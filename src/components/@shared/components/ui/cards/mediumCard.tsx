import { Card, CardContent, CardHeader, CardTitle } from '@src/components/@shared/components/ui/cards/card';

interface MediumCardProps {
  title: string;
  className?: string;
  size: 'small' | 'medium' | 'large';
  children?: React.ReactNode; // Torna `children` opcional
}

export const MediumCard: React.FC<MediumCardProps> = ({ children, size, title }) => {
  const cardSize =
    size === 'small'
      ? 'w-[24vw] h-[40vh] sm:w-[60vw] md:w-[44vw] 2xl:w-[25vw] xl:w-[23.5vw]'
      : size === 'medium'
        ? 'md:w-[88vw] xl:w-[23vw] 2xl:w-[25vw] h-[40vh]'
        : 'w-[1164px] h-[344px]'; // Caso 'large'

  return (
    <div className={`flex ${cardSize}`}>
      <Card className="flex w-full px-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-950">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};

export { Card, CardContent, CardHeader, CardTitle };
