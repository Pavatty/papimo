import { Logo } from "@/components/shared/Logo";

type Props = {
  adminName: string;
  pendingTasks: number;
};

export function AdminHeader({ adminName, pendingTasks }: Props) {
  return (
    <header className="border-bordurewarm-tertiary dark:border-encre/20 bg-blanc-casse dark:bg-encre/95 sticky top-0 z-20 border-b px-6 py-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-1">
            <Logo className="text-base" />
          </div>
          <p className="text-encre/70 dark:text-creme/70 text-xs">
            Panneau dense de gestion LODGE
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-corail rounded-full px-2.5 py-1 text-xs text-white">
            {pendingTasks} en attente
          </span>
          <span className="text-encre dark:text-creme text-sm font-medium">
            {adminName}
          </span>
        </div>
      </div>
    </header>
  );
}
