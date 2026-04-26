# Architecture papimo

## Vue d'ensemble

papimo est une application Next.js App Router connectée à Supabase (Auth, Postgres, Storage, Realtime), avec un back-office admin et des paiements Konnect/Stripe.

## Flow Auth (magic link)

```mermaid
sequenceDiagram
  participant U as Utilisateur
  participant FE as Next.js Front
  participant SB as Supabase Auth
  U->>FE: Soumet email
  FE->>SB: signInWithOtp()
  SB-->>U: Magic link email
  U->>FE: Ouvre lien callback
  FE->>SB: Exchange session
  FE->>SB: ensureProfile()
  FE-->>U: Session active + redirect dashboard
```

## Flow Publication

```mermaid
sequenceDiagram
  participant U as Utilisateur
  participant FE as PublishStepper
  participant SA as Server Actions
  participant DB as Supabase DB/Storage
  U->>FE: Remplit étapes publication
  FE->>SA: saveDraft (debounced)
  SA->>DB: upsert listing + amenities
  U->>FE: Upload photos
  FE->>SA: uploadListingImage
  SA->>DB: storage + listing_images
  U->>FE: Submit for review
  FE->>SA: submitForReview
  SA->>DB: moderation + status active/pending
```

## Flow Paiement

```mermaid
sequenceDiagram
  participant U as Utilisateur
  participant APP as Next.js
  participant GW as Konnect/Stripe
  participant DB as Supabase
  U->>APP: Choix pack/boost
  APP->>DB: transaction pending
  APP->>GW: init checkout
  GW-->>U: Page paiement
  GW->>APP: webhook
  APP->>DB: transaction completed/failed
  APP->>DB: activateListingPack/applyBoost
```

## Flow Messages

```mermaid
sequenceDiagram
  participant Buyer as Acheteur
  participant Seller as Vendeur
  participant SA as Server Actions
  participant RT as Supabase Realtime
  Buyer->>SA: sendMessage
  SA->>SA: Zod + moderation check
  SA->>RT: insert message
  RT-->>Seller: event message insert
  Seller->>SA: markConversationAsRead
```
