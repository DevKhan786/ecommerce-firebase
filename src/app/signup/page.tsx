"use client";

// app/signup/page.tsx
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import { createUser } from "@/lib/firebase/auth";
import { useAuthStore } from "@/store/useAuthStore";

export default function SignUpPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUser(email, password);
      setUser(userCredential.user);
      router.push("/");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error(errorMessage);
      if (err && typeof err === "object" && "code" in err) {
        if (err.code === "auth/email-already-in-use") {
          setError("Email already in use");
        } else if (err.code === "auth/invalid-email") {
          setError("Invalid email address");
        } else if (err.code === "auth/weak-password") {
          setError("Password is too weak");
        } else {
          setError("An error occurred. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>

        <div className="bg-white rounded-xl p-6 shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email Address"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FormInput
              label="Password"
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <FormInput
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link href="/signin" className="text-indigo-700 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
