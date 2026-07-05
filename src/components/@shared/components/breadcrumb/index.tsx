import { Fragment } from 'react';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Breadcrumb as BreadcrumbUI
} from '@src/components/@shared/components/ui/breadcrumb';

export type TItem = { label: string; href?: string };
type TProps = { items: TItem[] };

export default function Breadcrumb({ items }: TProps) {
  return (
    <BreadcrumbUI>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.label}>
            <BreadcrumbItem className="text-primary-dark">
              {item.href ? (
                <BreadcrumbLink href={item.href} className="hover:text-primary">
                  {item.label}
                </BreadcrumbLink>
              ) : (
                item.label
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbUI>
  );
}
