'use client';

import { getStringInitials } from '@src/lib/get-string-initials';
import { TUserToken } from '@src/domain/auth/entities/user-token.type';
import { LogOut } from 'lucide-react';
import useAuth from '@src/@shared/hooks/auth/use-auth.hook';

type TProps = { user: TUserToken };

export default function NavUser({ user }: TProps) {
  const { logOut } = useAuth();

  return (
    <div className="relative flex w-full items-center gap-3 border-t border-border px-4 py-3 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {getStringInitials(user.name)}
      </div>
      <div className="min-w-0 flex-1 pr-6 group-data-[state=collapsed]:hidden">
        <p className="truncate text-xs font-semibold text-foreground">{user.name}</p>
        <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
      </div>

      <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center group-data-[state=collapsed]:hidden">
        <button
          onClick={logOut}
          title="Logout"
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
