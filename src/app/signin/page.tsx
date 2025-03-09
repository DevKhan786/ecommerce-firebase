"use client";

// app/signin/page.tsx
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import { signIn } from "@/lib/firebase/auth";
import { useAuthStore } from "@/store/useAuthStore";

export default function SignInPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signIn(email, password);
      setUser(userCredential.user);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Sign In</h1>

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

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link href="/signup" className="text-indigo-700 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
