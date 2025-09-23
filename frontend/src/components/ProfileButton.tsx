import Link from "next/link";
import Profile from "./Icons/Profile";
import { cn } from "@/libs/utils";

export type ProfileButtonProps = {
    className?: string
}

export default function ProfileButton({
    className
}: ProfileButtonProps) {

    const classes = cn(
        "cursor-pointer border-secondary border-2 p-1 rounded-full",
        className
    );

    return (
        <Link href={'/profile'}  className={classes} title="Profile">
            <Profile />
        </Link>
    );
}