import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@src/components/@shared/components/ui/cards/card';
interface SmallCardProps {
  title: string;
  description: string;
  size: 'small' | 'large';
  children?: React.ReactNode; // Torna `children` opcional
}

export const SmallCard: React.FC<SmallCardProps> = ({ children, description, size, title }) => {
  const cardSize = size === 'small' ? '2xl:w-[8vw] h-[12vh] w-[60px]' : 'lg:h-[10vh] xl:h-[12vh] 2xl:h-[12vh] 2xl:w-[9vw]';
  return (
    <Card className={`flex items-center ${cardSize}`}>
      <CardHeader>
        <CardTitle className="flex text-xs font-medium text-blue-950">{title}</CardTitle>
        <CardDescription className="flex text-2xl font-bold text-blue-950">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
