'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "../Button";
import ThemeToggleBtn from "./ThemeToggleBtn";



export default function PublicNavbar() {

    const path = usePathname();
    
    return (
      <header className="flex items-center justify-between px-8 py-3">
        <Link href={"/"}>
          <h1 className="font-extrabold text-2xl">
            Store App
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggleBtn />
          {
              path === "/login" ?
              <Button as={Link} href="/signup" variant="primary">
                  Signup
              </Button> :
              <Button as={Link} href="/login" variant="primary">
                  Login
              </Button>
          }
        </div>
      </header>
    );
}