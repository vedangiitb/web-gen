"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import "../../app/globals.css";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import Link from "next/link";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  termsAccepted: boolean;
}

interface Errors {
  [key: string]: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    number: false,
    spChar: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "password") {
      setPasswordValidations({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /\d/.test(value),
        spChar: /[\W_]/.test(value),
      });
    }
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/.test(password);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Errors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof FormData]) {
        newErrors[key] = `${key} is required`;
      }
    });

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include an uppercase letter, a special character and a number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
      },
    });

    if (error) {
      setErrors({ err: error.message });
      setIsLoading(false);
    } else {
      router.push(`/account-verification?email=${formData.email}`);
    }
  };

  const errorMessage = Object.values(errors)[0];

  const handleGoogleSignup = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error(error);
  };

  return (
    <div className="px-[8%] py-[2%]">
      <h2 className="mb-2 text-4xl">Sign Up</h2>

      <div className="md:flex md:flex-row gap-4">
        <div className="flex-4 text-left mb-2">
          <h3 className="mb-2 md:mb-6 text-2xl">
           {" "}
            <span className="blue-txt">Rekruit</span>
          </h3>
          <div className="flex items-center gap-2 text-xl">
            <Check className="h-5 w-5 text-green-500" />
            <p>Bias Free Hiring</p>
          </div>
          <div className="flex items-center gap-2 text-xl">
            <Check className="h-5 w-5 text-green-500" />
            <p>Know where you stand and improve your skills</p>
          </div>
          <div className="flex items-center gap-2 text-xl">
            <Check className="h-5 w-5 text-green-500" />
            <p>Get hired where you deserve</p>
          </div>
        </div>

        <div className="auth-box flex-2">
          <img src="/logo.png" alt="logo" className="mb-5 w-4/5 mx-auto" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
            <Input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <div className="relative">
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setTooltipVisible(true)}
                onBlur={() => setTooltipVisible(false)}
                required
              />
              {tooltipVisible && (
                <div className="password-tool-tip">
                  <p className="blue-txt font-bold">Password Requirements</p>
                  <p
                    style={{
                      color: passwordValidations.length ? "green" : "red",
                    }}
                  >
                    At least 8 characters
                  </p>
                  <p
                    style={{
                      color: passwordValidations.uppercase ? "green" : "red",
                    }}
                  >
                    Include an uppercase letter
                  </p>
                  <p
                    style={{
                      color: passwordValidations.number ? "green" : "red",
                    }}
                  >
                    Include a number
                  </p>
                  <p
                    style={{
                      color: passwordValidations.spChar ? "green" : "red",
                    }}
                  >
                    Include a special character
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Checkbox
                id="terms"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    termsAccepted: !!checked,
                  }))
                }
                required
              />
              <Label htmlFor="terms" className="leading-tight">
                I agree to the{" "}
                <span className="underline cursor-pointer">Privacy Policy</span>{" "}
                and{" "}
                <span className="underline cursor-pointer">
                  Terms of Service
                </span>
              </Label>
            </div>

            {errorMessage && <p className="error-txt">{errorMessage}</p>}
            {isLoading && <p>Loading...</p>}

            <Button type="submit" className="w-full">
              Create Account
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full flex"
              onClick={handleGoogleSignup}
            >
              <img src="/google-logo.png" alt="google" className="h-5 w-5" />
              Sign up with Google
            </Button>

            <p className="forgot">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
