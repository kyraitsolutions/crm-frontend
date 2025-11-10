"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
// import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500); // fake loading for demo
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6 dark:from-gray-900 dark:to-gray-950">
      {/* <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      > */}
      <Card className="max-w-sm w-full border-none shadow-xl backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back 👋
          </CardTitle>
          <CardDescription>
            Sign in to continue to your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="my-6 flex items-center justify-center">
            <Separator className="w-1/4" />
            <span className="mx-2 text-sm text-muted-foreground">or</span>
            <Separator className="w-1/4" />
          </div>

          <div className="grid gap-3">
            {/* Google Login */}
            <Button
              asChild
              variant="outline"
              type="button"
              className={cn(
                "w-full flex items-center justify-center gap-2 hover:bg-gray-50"
              )}
            >
              <a href="http://localhost:3000/api/auth/google">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Continue with Google
              </a>
            </Button>

            {/* Apple Login */}
            <Button
              variant="outline"
              type="button"
              className="w-full flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current"
              >
                <path d="M16.365 1.43c0 1.14-.417 2.03-1.252 2.715-.9.715-1.904 1.07-3.01 1.01-.05-1.04.377-1.98 1.242-2.685.867-.71 1.888-1.08 3.02-1.04zm3.365 17.2c-.592 1.39-1.313 2.59-2.168 3.6-.916 1.09-1.742 1.63-2.477 1.63-.41 0-.91-.12-1.48-.36-.57-.24-1.1-.36-1.57-.36-.49 0-1.04.12-1.64.36-.6.24-1.08.37-1.46.37-.69 0-1.44-.51-2.25-1.54-.82-1.03-1.51-2.22-2.06-3.57-.56-1.38-.84-2.7-.84-3.97 0-1.47.31-2.74.93-3.82.59-1.03 1.38-1.54 2.36-1.54.46 0 1.02.11 1.68.34.65.22 1.08.33 1.3.33.17 0 .65-.16 1.44-.47.76-.28 1.4-.42 1.92-.42 1.4 0 2.56.59 3.44 1.78.82 1.09 1.24 2.52 1.24 4.3 0 1.27-.25 2.57-.73 3.9z" />
              </svg>
              Continue with Apple
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center mt-4 text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="ml-1 font-medium text-primary hover:underline"
          >
            Sign up
          </a>
        </CardFooter>
      </Card>
      {/* </motion.div> */}
    </div>
  );
}
