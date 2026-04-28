import Link from "next/link";

import {
  resetUserPasswordAction,
  suspendUserAction,
  updateUserRoleAction,
  verifyKycAction,
} from "@/app/[locale]/(admin)/admin/actions";
import { requireAdmin } from "@/lib/admin/guards";
import type { Database } from "@/types/database";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; role?: string; page?: string }>;
};

export default async function AdminUsersPage({ params, searchParams }: Props) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const { supabase } = await requireAdmin(locale);

  const page = Number(query.page ?? "1");
  const pageSize = 20;
  let req = supabase
    .from("profiles")
    .select("id, full_name, email, role, kyc_status, is_verified, created_at")
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (query.q)
    req = req.or(`full_name.ilike.%${query.q}%,email.ilike.%${query.q}%`);
  if (query.role) req = req.eq("role", query.role as ProfileRow["role"]);
  const { data: users } = await req;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-encre dark:text-creme text-2xl font-bold">
        Gestion utilisateurs
      </h1>

      <form className="border-bordurewarm-tertiary dark:border-encre/20 grid gap-2 rounded-xl border bg-white p-4 md:grid-cols-3">
        <input
          name="q"
          defaultValue={query.q}
          placeholder="Recherche nom/email"
          className="border-bordurewarm-tertiary dark:border-encre/20 rounded-lg border px-2 py-1.5 text-sm"
        />
        <input
          name="role"
          defaultValue={query.role}
          placeholder="role"
          className="border-bordurewarm-tertiary dark:border-encre/20 rounded-lg border px-2 py-1.5 text-sm"
        />
        <button className="bg-corail rounded-lg px-3 py-1.5 text-sm text-white">
          Filtrer
        </button>
      </form>

      <div className="border-bordurewarm-tertiary dark:border-encre/20 overflow-auto rounded-xl border bg-white">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-creme-pale dark:bg-encre/60 text-encre/70 dark:text-creme/70 text-xs">
            <tr>
              <th className="px-3 py-2 text-left">Utilisateur</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-left">KYC</th>
              <th className="px-3 py-2 text-left">Vérifié</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((user) => (
              <tr
                key={user.id}
                className="border-bordurewarm-tertiary dark:border-encre/20 border-t align-top"
              >
                <td className="px-3 py-2">
                  <p className="text-encre dark:text-creme font-medium">
                    {user.full_name ?? "N/A"}
                  </p>
                  <p className="text-encre/70 dark:text-creme/70 text-xs">
                    {user.email ?? "N/A"}
                  </p>
                </td>
                <td className="px-3 py-2">{user.role}</td>
                <td className="px-3 py-2">{user.kyc_status}</td>
                <td className="px-3 py-2">
                  {user.is_verified ? "Oui" : "Non"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Link
                      href={`/${locale}/admin/users/${user.id}`}
                      className="border-bordurewarm-tertiary dark:border-encre/20 rounded border bg-white px-2 py-1"
                    >
                      Voir profil
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await verifyKycAction(locale, user.id);
                      }}
                    >
                      <button className="rounded bg-emerald-600/15 px-2 py-1 text-emerald-600">
                        Vérifier KYC
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await suspendUserAction(locale, user.id);
                      }}
                    >
                      <button className="bg-creme dark:bg-encre rounded px-2 py-1">
                        Suspendre
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await updateUserRoleAction(locale, user.id, "admin");
                      }}
                    >
                      <button className="bg-bleu-pale text-bleu rounded px-2 py-1">
                        Promouvoir admin
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await updateUserRoleAction(
                          locale,
                          user.id,
                          "moderator",
                        );
                      }}
                    >
                      <button className="bg-bleu-pale text-bleu rounded px-2 py-1">
                        Promouvoir moderator
                      </button>
                    </form>
                    {user.email ? (
                      <form
                        action={async () => {
                          "use server";
                          await resetUserPasswordAction(locale, user.email!);
                        }}
                      >
                        <button className="border-bordurewarm-tertiary dark:border-encre/20 rounded border bg-white px-2 py-1">
                          Reset mdp
                        </button>
                      </form>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
