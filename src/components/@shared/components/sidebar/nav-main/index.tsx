'use client';

import { type LucideIcon, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@src/lib/utils';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from '@src/components/@shared/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@src/components/@shared/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@src/components/@shared/components/ui/dropdown-menu';

type TSubItem = {
  title: string;
  url: string;
  isDisabled?: boolean;
  icon?: LucideIcon;
};

type TItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isDisabled?: boolean;
  items?: TSubItem[];
};

type TProps = { items: TItem[] };

export default function NavMain({ items }: TProps) {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <SidebarGroup className="overflow-x-hidden overflow-y-auto px-2 py-2 group-data-[collapsible=icon]:px-0 group-data-[state=expanded]:px-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-400/30 [&::-webkit-scrollbar-track]:bg-transparent">
      <SidebarMenu className="group-data-[collapsible=icon]:items-center">
        {items.map(item => {
          if (item.items && item.items.length > 0) {
            const subItems = item.items;
            const isSubActive = subItems.some(subItem => (subItem.url ? pathname.startsWith(subItem.url) : false));

            if (state === 'collapsed') {
              return (
                <SidebarMenuItem key={item.title} className={cn(item.isDisabled && 'hidden')}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn(
                          'h-10 rounded-xl text-sm text-black dark:text-zinc-300 hover:bg-[#C9D4E4] dark:hover:bg-white/10 hover:text-black dark:hover:text-white active:bg-[#C9D4E4]! dark:active:bg-white/10!',
                          isSubActive && 'text-brand!'
                        )}
                      >
                        {item.icon && <item.icon className="min-h-5 min-w-5" />}
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      {subItems.map(subItem => {
                        const isSubItemActive = subItem.url ? pathname.startsWith(subItem.url) : false;

                        return (
                          <DropdownMenuItem key={subItem.title} asChild className={cn(subItem.isDisabled && 'hidden')}>
                            <a
                              href={subItem.url}
                              className={cn(
                                'flex items-center gap-2 text-sm text-black dark:text-zinc-300 hover:bg-[#C9D4E4] dark:hover:bg-white/10 hover:text-black dark:hover:text-white',
                                isSubItemActive && 'bg-[#becde4]! dark:bg-brand-light! text-brand!'
                              )}
                            >
                              {subItem.icon && <subItem.icon className="min-h-4 min-w-4" />}
                              <span>{subItem.title}</span>
                            </a>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            }

            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isSubActive}
                className="group/collapsible w-full group-data-[collapsible=icon]:w-fit"
              >
                <SidebarMenuItem className={cn(item.isDisabled && 'hidden')}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-10 rounded-xl text-sm text-black dark:text-zinc-300 hover:bg-[#C9D4E4] dark:hover:bg-white/10 hover:text-black dark:hover:text-white active:bg-[#C9D4E4]! dark:active:bg-white/10! data-[state=open]:bg-transparent data-[state=open]:text-black dark:data-[state=open]:text-white data-[state=open]:hover:bg-[#C9D4E4] dark:data-[state=open]:hover:bg-white/10">
                      {item.icon && <item.icon className="min-h-5 min-w-5" />}
                      <span className="group-data-[state=collapsed]:hidden">{item.title}</span>
                      <ChevronRight className="ml-auto min-h-4 min-w-4 transition-transform duration-200 group-data-[state=collapsed]:hidden group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {subItems.map(subItem => {
                        const isSubItemActive = subItem.url
                          ? pathname.startsWith(subItem.url) &&
                            !subItems.some(other => other.url !== subItem.url && other.url.startsWith(subItem.url) && pathname.startsWith(other.url))
                          : false;

                        return (
                          <SidebarMenuSubItem key={subItem.title} className={cn(subItem.isDisabled && 'hidden')}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubItemActive}
                              className={cn(
                                'h-8 rounded-lg text-sm text-black dark:text-zinc-300 hover:bg-[#C9D4E4] dark:hover:bg-white/10 hover:text-black dark:hover:text-white active:bg-[#becde4]! dark:active:bg-brand-light! data-[active=true]:text-brand!',
                                isSubItemActive && 'bg-[#becde4]! dark:bg-brand-light! hover:bg-[#becde4]! dark:hover:bg-brand-light! data-[active=true]:bg-[#becde4]! dark:data-[active=true]:bg-brand-light!'
                              )}
                            >
                              <a href={subItem.url}>
                                {subItem.icon && <subItem.icon className="min-h-4 min-w-4" />}
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          const isActive = item.url
            ? pathname.startsWith(item.url) &&
              !items.some(other => other.url && other.url !== item.url && other.url.startsWith(item.url as string) && pathname.startsWith(other.url))
            : false;

          return (
            <SidebarMenuItem key={item.title} className={cn(item.isDisabled && 'hidden')}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.title}
                className={cn(
                  'h-10 rounded-xl text-sm text-black dark:text-zinc-300 hover:bg-[#C9D4E4] dark:hover:bg-white/10 hover:text-black dark:hover:text-white active:bg-[#becde4]! dark:active:bg-brand-light! data-[active=true]:text-brand!',
                  isActive && 'bg-[#becde4]! dark:bg-brand-light! hover:bg-[#becde4]! dark:hover:bg-brand-light! data-[active=true]:bg-[#becde4]! dark:data-[active=true]:bg-brand-light!',
                  !item.url && 'opacity-60 hover:cursor-not-allowed'
                )}
              >
                <a href={item.url}>
                  {item.icon && <item.icon className="min-h-5 min-w-5" />}
                  <span className="group-data-[state=collapsed]:hidden">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
