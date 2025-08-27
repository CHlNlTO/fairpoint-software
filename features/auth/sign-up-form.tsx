"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { GoogleSignInButton } from "./google-signin-button";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
      <CardHeader>
        <div className="flex flex-col items-center gap-4">
        <div className="relative w-[120px] h-[60px] overflow-hidden">
          <Image
          src="/check.png"
          alt="Fairpoint Logo"
          width={10000}
          height={10000}
          className="absolute top-[-50%] w-[120px] h-auto"
          />
        </div>
        <div className="flex flex-col text-center">
          <CardTitle className="text-2xl">Let&apos;s get started!</CardTitle>
          <CardDescription>
          Your smart accounting journey begins here
          </CardDescription>
        </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp}>
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
              id="firstName"
              type="text"
              placeholder="Juan"
              required
              className="placeholder:text-muted-foreground"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              />
              </div>
              <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
              id="lastName"
              type="text"
              placeholder="Dela Cruz"
              required
              className="placeholder:text-muted-foreground"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              />
              </div>
            </div>
            <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
            id="email"
            type="email"
            placeholder="juandelacruz@example.com"
            required
            className="placeholder:text-muted-foreground"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            </div>
          <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>
          <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="repeat-password">Repeat Password</Label>
          </div>
          <Input
            id="repeat-password"
            type="password"
            required
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-[#38B6FF] hover:bg-[#38B6FF]/90" disabled={isLoading}>
            {isLoading ? "Creating an account..." : "Sign up"}
            </Button>

          <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
            Or continue with
            </span>
          </div>
          </div>

          <GoogleSignInButton className="w-full rounded-md" />
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline underline-offset-4">
          Login
          </Link>
        </div>
        </form>
      </CardContent>
      </Card>
    </div>
  );
}
