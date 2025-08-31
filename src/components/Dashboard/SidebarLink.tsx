import Link from "next/link";

interface SidebarLinkProps {
    href: string;
    label: string;
    active: boolean;
}

export default function SidebarLink({ href, label, active }: SidebarLinkProps) {
    return (
        <li>
            <Link
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${active
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
            >
                {label}
            </Link>
        </li>
    );
}