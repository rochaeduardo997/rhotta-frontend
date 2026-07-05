import { Car } from 'lucide-react';

export default function NavLogo() {
  return (
    <div className="flex items-center gap-3 pt-6 pb-4 px-6 justify-center group-data-[state=expanded]:justify-start">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Car className="h-5 w-5" />
      </div>
      <span className="font-bold text-lg text-foreground tracking-tight group-data-[state=collapsed]:hidden">
        Rhotta
      </span>
    </div>
  );
}
