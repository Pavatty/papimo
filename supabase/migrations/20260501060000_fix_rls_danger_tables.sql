-- LODGE — Restore RLS policies cascade-droppées par PR #76
-- Adapté aux schémas réels (audit ÉTAPE 1).
-- - boosts        : pas de user_id, ownership via listings.owner_id
-- - conversations : buyer_id, seller_id (pas participant_ids[])
-- - leads         : user_id (visiteur) + partner_id (sans lien auth direct)
-- - messages      : sender_id + conversations(buyer_id, seller_id)
-- - partners      : table directory publique
-- - saved_searches, subscriptions, transactions : user_id standard
-- - settings (legacy) : key/value/updated_by

-- ============================================================
-- 1. messages
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='messages_select_party' AND tablename='messages') THEN
    CREATE POLICY messages_select_party ON public.messages FOR SELECT USING (
      sender_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = messages.conversation_id
          AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
      )
      OR public.is_admin(auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='messages_insert_sender' AND tablename='messages') THEN
    CREATE POLICY messages_insert_sender ON public.messages FOR INSERT WITH CHECK (
      auth.uid() = sender_id
      AND EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = conversation_id
          AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
      )
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='messages_update_sender' AND tablename='messages') THEN
    CREATE POLICY messages_update_sender ON public.messages FOR UPDATE USING (
      auth.uid() = sender_id OR public.is_admin(auth.uid())
    );
  END IF;
END $$;

-- ============================================================
-- 2. conversations
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='conversations_select_party' AND tablename='conversations') THEN
    CREATE POLICY conversations_select_party ON public.conversations FOR SELECT USING (
      auth.uid() = buyer_id OR auth.uid() = seller_id OR public.is_admin(auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='conversations_insert_buyer' AND tablename='conversations') THEN
    CREATE POLICY conversations_insert_buyer ON public.conversations FOR INSERT WITH CHECK (
      auth.uid() = buyer_id
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='conversations_update_party' AND tablename='conversations') THEN
    CREATE POLICY conversations_update_party ON public.conversations FOR UPDATE USING (
      auth.uid() = buyer_id OR auth.uid() = seller_id OR public.is_admin(auth.uid())
    );
  END IF;
END $$;

-- ============================================================
-- 3. saved_searches
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='saved_searches_owner_select' AND tablename='saved_searches') THEN
    CREATE POLICY saved_searches_owner_select ON public.saved_searches FOR SELECT USING (
      auth.uid() = user_id OR public.is_admin(auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='saved_searches_owner_insert' AND tablename='saved_searches') THEN
    CREATE POLICY saved_searches_owner_insert ON public.saved_searches FOR INSERT WITH CHECK (
      auth.uid() = user_id
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='saved_searches_owner_update' AND tablename='saved_searches') THEN
    CREATE POLICY saved_searches_owner_update ON public.saved_searches FOR UPDATE USING (
      auth.uid() = user_id
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='saved_searches_owner_delete' AND tablename='saved_searches') THEN
    CREATE POLICY saved_searches_owner_delete ON public.saved_searches FOR DELETE USING (
      auth.uid() = user_id
    );
  END IF;
END $$;

-- ============================================================
-- 4. boosts (ownership via listings.owner_id)
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='boosts_owner_select' AND tablename='boosts') THEN
    CREATE POLICY boosts_owner_select ON public.boosts FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.listings l WHERE l.id = boosts.listing_id AND l.owner_id = auth.uid())
      OR public.is_admin(auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='boosts_owner_insert' AND tablename='boosts') THEN
    CREATE POLICY boosts_owner_insert ON public.boosts FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.owner_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='boosts_admin_update' AND tablename='boosts') THEN
    CREATE POLICY boosts_admin_update ON public.boosts FOR UPDATE USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- ============================================================
-- 5. leads (user_id = visiteur, partner_id = destinataire sans lien auth)
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='leads_visitor_select' AND tablename='leads') THEN
    CREATE POLICY leads_visitor_select ON public.leads FOR SELECT USING (
      auth.uid() = user_id OR public.is_admin(auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='leads_visitor_insert' AND tablename='leads') THEN
    CREATE POLICY leads_visitor_insert ON public.leads FOR INSERT WITH CHECK (
      auth.uid() = user_id
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='leads_admin_all' AND tablename='leads') THEN
    CREATE POLICY leads_admin_all ON public.leads FOR ALL USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- ============================================================
-- 6. transactions
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='transactions_owner_select' AND tablename='transactions') THEN
    CREATE POLICY transactions_owner_select ON public.transactions FOR SELECT USING (
      auth.uid() = user_id OR public.is_admin(auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='transactions_owner_insert' AND tablename='transactions') THEN
    CREATE POLICY transactions_owner_insert ON public.transactions FOR INSERT WITH CHECK (
      auth.uid() = user_id
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='transactions_admin_update' AND tablename='transactions') THEN
    CREATE POLICY transactions_admin_update ON public.transactions FOR UPDATE USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- ============================================================
-- 7. subscriptions
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='subscriptions_owner_select' AND tablename='subscriptions') THEN
    CREATE POLICY subscriptions_owner_select ON public.subscriptions FOR SELECT USING (
      auth.uid() = user_id OR public.is_admin(auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='subscriptions_owner_insert' AND tablename='subscriptions') THEN
    CREATE POLICY subscriptions_owner_insert ON public.subscriptions FOR INSERT WITH CHECK (
      auth.uid() = user_id
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='subscriptions_admin_all' AND tablename='subscriptions') THEN
    CREATE POLICY subscriptions_admin_all ON public.subscriptions FOR ALL USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- ============================================================
-- 8. partners (directory public)
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='partners_public_read' AND tablename='partners') THEN
    CREATE POLICY partners_public_read ON public.partners FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='partners_admin_write' AND tablename='partners') THEN
    CREATE POLICY partners_admin_write ON public.partners FOR ALL USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- ============================================================
-- 9. settings (legacy — app_settings est la table active)
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='settings_public_read' AND tablename='settings') THEN
    CREATE POLICY settings_public_read ON public.settings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='settings_admin_write' AND tablename='settings') THEN
    CREATE POLICY settings_admin_write ON public.settings FOR ALL USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- ============================================================
-- VERIFICATION
-- ============================================================
DO $$
DECLARE
  danger_count INT;
BEGIN
  SELECT COUNT(*) INTO danger_count
  FROM pg_tables t
  LEFT JOIN (SELECT tablename, COUNT(*) AS cnt FROM pg_policies WHERE schemaname='public' GROUP BY tablename) p
    ON p.tablename = t.tablename
  WHERE t.schemaname='public'
    AND t.rowsecurity=true
    AND COALESCE(p.cnt, 0) = 0
    AND t.tablename IN ('boosts','conversations','leads','messages','partners','saved_searches','settings','subscriptions','transactions');

  RAISE NOTICE 'Tables danger restantes (target=0): %', danger_count;
END $$;
