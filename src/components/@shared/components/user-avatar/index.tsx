'use client';

import { Avatar, AvatarFallback } from '@src/components/@shared/components/ui/avatar';
import { getStringInitials } from '@src/lib/get-string-initials';
import useAuth from '@src/@shared/hooks/auth/use-auth.hook';

type TProps = { className?: string };

export default function UserAvatar({ className }: TProps) {
  const { user } = useAuth();

  if (!user) return <></>;

  return (
    <Avatar className={className ?? 'h-24 w-24 rounded-full border-2 border-[#85B8FF]'}>
      <AvatarFallback className="rounded-lg">{getStringInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
}
