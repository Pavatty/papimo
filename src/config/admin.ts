// Configuration admin RBAC LODGE.
// 3 rôles, 8 permissions, navigation sidebar gated par permission.

export type AdminRole = "super_admin" | "admin" | "moderator";

export interface AdminPermission {
  id: string;
  label: { fr: string; en: string };
  roles: AdminRole[];
}

export const ADMIN_PERMISSIONS: AdminPermission[] = [
  {
    id: "settings.read",
    label: { fr: "Voir paramètres", en: "View settings" },
    roles: ["super_admin", "admin", "moderator"],
  },
  {
    id: "settings.write",
    label: { fr: "Modifier paramètres", en: "Edit settings" },
    roles: ["super_admin", "admin"],
  },
  {
    id: "users.read",
    label: { fr: "Voir utilisateurs", en: "View users" },
    roles: ["super_admin", "admin", "moderator"],
  },
  {
    id: "users.ban",
    label: { fr: "Bannir utilisateurs", en: "Ban users" },
    roles: ["super_admin", "admin"],
  },
  {
    id: "listings.moderate",
    label: { fr: "Modérer annonces", en: "Moderate listings" },
    roles: ["super_admin", "admin", "moderator"],
  },
  {
    id: "listings.delete",
    label: { fr: "Supprimer annonces", en: "Delete listings" },
    roles: ["super_admin", "admin"],
  },
  {
    id: "modules.toggle",
    label: { fr: "Activer/désactiver modules", en: "Toggle modules" },
    roles: ["super_admin"],
  },
  {
    id: "admin.manage",
    label: { fr: "Gérer admins", en: "Manage admins" },
    roles: ["super_admin"],
  },
];

export interface AdminNavItem {
  label: { fr: string; en: string };
  href: string;
  icon: string;
  permission: string;
}

export const ADMIN_NAV: AdminNavItem[] = [
  {
    label: { fr: "Dashboard", en: "Dashboard" },
    href: "/admin",
    icon: "LayoutDashboard",
    permission: "settings.read",
  },
  {
    label: { fr: "Paramètres", en: "Settings" },
    href: "/admin/settings",
    icon: "Settings",
    permission: "settings.read",
  },
  {
    label: { fr: "Utilisateurs", en: "Users" },
    href: "/admin/users",
    icon: "Users",
    permission: "users.read",
  },
  {
    label: { fr: "Annonces", en: "Listings" },
    href: "/admin/listings",
    icon: "List",
    permission: "listings.moderate",
  },
  {
    label: { fr: "Modération", en: "Moderation" },
    href: "/admin/moderation",
    icon: "Shield",
    permission: "listings.moderate",
  },
  {
    label: { fr: "Modules", en: "Modules" },
    href: "/admin/modules",
    icon: "Puzzle",
    permission: "modules.toggle",
  },
];

export function hasPermission(role: AdminRole, permissionId: string): boolean {
  const perm = ADMIN_PERMISSIONS.find((p) => p.id === permissionId);
  if (!perm) return false;
  return perm.roles.includes(role);
}
