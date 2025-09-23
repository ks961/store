'use client';
import Link from "next/link";
import ThemeToggleBtn from "./ThemeToggleBtn";
import ProfileButton from "../ProfileButton";
import Button from "../Button";
import { useLogout } from "@/features/auth/useLogout";
import { useRouter } from "next/navigation";


export default function ProtectedNavbar() {

  const logoutMutation = useLogout();

  const router = useRouter();

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSuccess: (response) => {
        if(response.data.success) {
          router.replace("/login");
        }
      }
    })
  }


  return (
      <header className="flex items-center justify-between px-8 py-3 shadow-lg bg-accent">
        <Link href={"/"}>
          <h1 className="font-extrabold text-2xl text-primary-foreground">
            Store App
          </h1>
        </Link>
        <div className="flex items-center gap-4">
            <ProfileButton />
            <ThemeToggleBtn 
                className="border-secondary"
            />
            <Button onClick={handleLogout} as="button" variant="outline-accent" className="font-semibold shadow-lg">
              Logout
            </Button>
        </div>
      </header>
    );
}