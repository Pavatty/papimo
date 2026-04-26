import { Logo } from "@/components/shared/Logo";

type Props = {
  adminName: string;
  pendingTasks: number;
};

export function AdminHeader({ adminName, pendingTasks }: Props) {
  return (
    <header className="border-line bg-paper sticky top-0 z-20 border-b px-6 py-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-1">
            <Logo className="text-base" />
          </div>
          <p className="text-ink-soft text-xs">
            Panneau dense de gestion papimo
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-corail rounded-full px-2.5 py-1 text-xs text-white">
            {pendingTasks} en attente
          </span>
          <span className="text-ink text-sm font-medium">{adminName}</span>
        </div>
      </div>
    </header>
  );
}
