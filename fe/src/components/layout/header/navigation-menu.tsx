import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/libs";
import { TOEIC_NAVIGATION, type NavigationItem } from "@/constants/navigation";

interface NavigationMenuProps {
  className?: string;
  onItemClick?: () => void;
}

export function NavigationMenu({
  className,
  onItemClick,
}: NavigationMenuProps) {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className={className}>
      {TOEIC_NAVIGATION.map((item) => {
        const Icon = item.icon;
        const isActive = isActiveLink(item.href);

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              isActive
                ? "bg-white/20 text-white shadow-sm"
                : "text-white/80 hover:text-white hover:bg-white/10"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
