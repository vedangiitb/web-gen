"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/components/auth/AuthContext";

type IdTokenPayload = {
  email: string;
  sub: string;
  email_verified: boolean;
};

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      console.error("OAuth error:", error, errorDescription);
      router.push("/login?error=oauth_failed");
      return;
    }

    if (code) {
      exchangeCodeForTokens(code);
    } else {
      router.push("/login?error=oauth_failed");
    }
  }, [searchParams]);

  const exchangeCodeForTokens = async (code: string) => {
    try {
      const tokenEndpoint = `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/token`;

      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
          code,
          redirect_uri: "http://localhost:3000/callback",
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`Token exchange failed: ${errorResponse}`);
      }

      const tokens = await response.json();

      // Save tokens
      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("id_token", tokens.id_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);

      // Decode ID token to get user info
      const decoded: IdTokenPayload = jwtDecode(tokens.id_token);
      setUser(decoded.email || decoded.sub);

      router.push("/account");
    } catch (error) {
      console.error("Token exchange error:", error);
      router.push("/login?error=oauth_failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Processing your Google login...</p>
      </div>
    </div>
  );
}
