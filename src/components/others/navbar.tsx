"use client";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../ui/button";

export default function NavBar() {
  const user = useAuth();

  return (
    <div>
      <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-medium tracking-tight orbitron text-white">
            Web Gen
          </h1>
        </div>

        <div className="flex items-center gap-8">
          {user.currentUser === "Login" ? (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-white hover:text-blue-200 hover:bg-blue-50 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300  cursor-pointer">
                  Get Started
                </Button>
              </Link>
            </>
          ) : null}
        </div>
      </header>
    </div>
  );
}
