import { cn } from '@src/lib/utils';
import { Textarea as TextareaUI } from '@src/components/@shared/components/ui/textarea';
import { cva } from 'class-variance-authority';

const variants = cva(
  'text-primary-dark dark:text-foreground border-2 border-input-border bg-white dark:bg-zinc-950 px-3 text-sm transition-colors placeholder:text-input-placeholder focus-visible:ring focus-visible:ring-offset-0'
);

type TProps = {
  name: string;
  label?: string;
} & React.ComponentProps<typeof TextareaUI>;

export default function Textarea({ className, disabled, ...props }: TProps) {
  return <TextareaUI className={cn(variants(), className)} {...props} disabled={disabled} />;
}
