"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthContext";
import { supabase } from "@/lib/supabaseClient"; // <- Make sure you have this

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // You can fetch current user session here if needed
    supabase.auth.getUser().then(({ data }) => {
      console.log(data)
      if (data?.user) {
        if (data.user.email) {
          setUser(data.user.user_metadata.full_name ?? data.user.email ?? "User");
          router.push("/account");
        }
      }
    });
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      if (data.user.email) {
        setUser(data.user.email);
        router.push("/account");
      }
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/account`, // Or /callback if you handle logic there
      },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="px-[8%] py-[2%] text-center">
      <h2 className="mb-2 md:mb-6">Candidate Login</h2>
      <div className="auth-box w-5/6 sm:w-4/6 md:w-2/6">
        <img src="/logo.png" alt="logo" className="mb-5 w-4/5 mx-auto" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isLoading && <p>Loading...</p>}
          {error && <p className="error-txt">{error}</p>}
          <Button type="submit" className="w-full">
            Submit
          </Button>
          <p className="blue-txt cursor-pointer text-sm underline">
            Forgot Password?
          </p>
          <p>Or</p>
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
          >
            <img src="/google-logo.png" alt="google" className="h-5 w-5" />
            <span>Sign in with Google</span>
          </Button>
          <p className="forgot">
            Don't have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
