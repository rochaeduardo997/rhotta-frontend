import { AlertCircle, Check, CheckCheck, CheckCircle2, Clock, LucideProps, RotateCw, Send, X } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

type TConfig = { label: string; icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>; color: string; bg: string };
type TType = { [key: string]: TConfig };

export const STATUS_CONFIG: TType = {
  answered: { label: 'answered', icon: CheckCheck, color: 'text-[#089428]', bg: 'bg-[#defbde]' },
  analyzed: { label: 'finished', icon: CheckCircle2, color: 'text-[#089428]', bg: 'bg-[#defbde]' },
  failed: { label: 'failed', icon: X, color: 'text-danger', bg: 'bg-danger-light' },
  analysing: { label: 'analysing', icon: Clock, color: 'text-[#de7600]', bg: 'bg-[#ffeed4]' },
  viewed: { label: 'viewed', icon: Check, color: 'text-[#3730A3]', bg: 'bg-[#E0E7FF]' },
  preparing: { label: 'preparing', icon: RotateCw, color: 'text-[#3730A3]', bg: 'bg-[#E0E7FF]' },
  sended: { label: 'sended', icon: Send, color: 'text-muted-foreground', bg: 'bg-secondary' },
  idle: { label: 'idle', icon: AlertCircle, color: 'text-muted-foreground', bg: 'bg-secondary' }
};
