import type { UserData } from "@gradlly/utils";

interface UserCardProps {
  user: UserData;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-200">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
          {user.avatar}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {user.name}
          </p>
          <p className="truncate text-xs text-slate-300">{user.role}</p>
        </div>
      </div>
      <p className="mt-2 truncate text-xs text-slate-400">{user.email}</p>
      <p className="truncate text-xs text-slate-400">{user.company}</p>
    </div>
  );
}
