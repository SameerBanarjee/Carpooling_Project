import { Car } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  iconClassName?: string;
};

export function Logo({ className, iconClassName }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 text-2xl font-bold text-primary", className)}>
      <Car className={cn("h-8 w-8", iconClassName)} />
      <h1 className="font-headline">RideLink</h1>
    </div>
  );
}
