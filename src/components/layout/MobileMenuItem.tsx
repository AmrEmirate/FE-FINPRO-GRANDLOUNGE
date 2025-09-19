// src/components/layout/MobileMenuItem.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileMenuItemProps {
  href: string;
  children: React.ReactNode;
  isPrimary?: boolean;
  onClick: () => void;
}

export const MobileMenuItem = ({ href, children, isPrimary, onClick }: MobileMenuItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  // Tentukan class styling berdasarkan kondisi
  const baseClasses = "block px-3 py-2 text-base font-medium rounded-md transition-colors w-full text-left";
  const activeClasses = "text-amber-600 bg-amber-50";
  const inactiveClasses = "text-gray-700 hover:text-amber-600 hover:bg-gray-50";
  const primaryClasses = "bg-gray-900 text-white hover:bg-gray-800 mt-1";

  const finalClasses = `${baseClasses} ${
    isPrimary ? primaryClasses : (isActive ? activeClasses : inactiveClasses)
  }`;

  return (
    <Link href={href} className={finalClasses} onClick={onClick}>
      {children}
    </Link>
  );
};