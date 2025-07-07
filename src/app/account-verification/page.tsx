"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "../../app/globals.css";

export default function AccountVerification() {
  const [email, setEmail] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    setEmail(emailParam);
  }, [searchParams]);

  return (
    <div className="px-[8%] py-[2%] text-center">
      <h2 className="mb-4 md:mb-6">Verify Your Email</h2>
      {email ? (
        <p className="mb-2">
          We've sent a confirmation link to{" "}
          <span className="blue-txt">{email}</span>. <br />
          Please check your inbox and click the link to activate your account.
        </p>
      ) : (
        <p className="error-txt mb-2">Invalid access. Please sign up again.</p>
      )}
    </div>
  );
}
