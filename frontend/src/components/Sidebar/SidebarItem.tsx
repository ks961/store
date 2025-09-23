import Link from "next/link";

export type SidebarItemProps = {
    href: string,
    title: string
}

export default function SidebarItem({
    href,
    title
}: SidebarItemProps) {
    return (
        <Link href={href} className="bg-secondary w-full h-max px-4 py-2 rounded-md hover:bg-primary transition-all duration-300">
            {title}
        </Link>
    );
}