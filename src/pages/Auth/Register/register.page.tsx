import Section from "@/components/sections/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { COOKIES_STORAGE } from "@/constants";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services";
// import { motion } from "framer-motion";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const features = [
  {
    icon: "⚡",
    title: "Instant setup",
    desc: "Get your workspace ready in under 2 minutes.",
  },
  {
    icon: "🔒",
    title: "Enterprise-grade security",
    desc: "Your data is encrypted and never shared.",
  },
  {
    icon: "🌍",
    title: "Global reach",
    desc: "Operate across regions with multi-currency support.",
  },
];
export function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState({
    message: "",
    status: false
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const authService = new AuthService();
  const handleRegister = async (e: React.FormEvent) => {

    e.preventDefault();

    if (formData.confirmPassword !== formData.password) {
      setError({ message: "Passwords do not match", status: true });
      return;
    }
    try {
      setLoading(true);

      const response = await authService.register(formData);
      console.log("Registration response:", response.data); // Log the response for debugging
      if (response.status === 201) {
        CookieUtils.setItem(COOKIES_STORAGE.auth_token, response.data?.doc?.token);
        navigate("/", { replace: true });
      }
    }
    catch (error: any) {
      setError({ message: error.message, status: true })
      console.log(error)
      console.error("Registration error:", error);
    }
    finally {
      setLoading(false);
    }
  };



  return (
    <Section>
      <div className="h-screen w-screen flex ">
        <aside
          className="hidden lg:flex flex-col gap-16 w-[65%] p-10 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, #3B1FA8 0%, #7C3AED 55%, #C026D3 100%)",
          }}
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 bg-[radial-gradient(circle,#fff,transparent)]" />
          <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full opacity-10 bg-[radial-gradient(circle,#fff,transparent)]" />

          {/* Brand */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-16">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold text-white bg-white/50 backdrop-blur-sm">
                ◈
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">
                Kyra CRM
              </span>
            </div>

            <p className="text-xs font-semibold tracking-widest uppercase text-white mb-4">
              Almost there
            </p>
            <h1 className="text-4xl font-bold text-white leading-snug mb-4">
              Looks like new <br />
              <span className="text-white">Create your account</span>
            </h1>
            <p className="text-purple-300 text-sm leading-relaxed max-w-xs">
              Tell us about your company so we can personalise your workspace,
              invoices, and reports from day one.
            </p>
          </div>

          {/* Features */}
          <div className="relative z-10 space-y-5">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-white">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{f.title}</p>
                  <p className="text-purple-300 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="relative z-10 text-white text-xs">
            © {new Date().getFullYear()} Kyra AI CRM · Privacy · Terms
          </p>
        </aside>
        <div className="flex flex-1 justify-center h-full bg-white">
          <div className="w-full p-10 flex flex-col justify-center max-w-md">
            <div className="">
              <h1 className="text-2xl font-semibold">
                Create an account
              </h1>
              <p className="text-muted-foreground text-sm">
                Sign up to get started
              </p>
            </div>
            {/* Invalid creds error  */}
            <div>
              {error.status && <p className="mt-2 text-xs text-red-500">{error.message}</p>}
            </div>
            <form onSubmit={handleRegister} className="space-y-5 mt-3">
              <div className="grid gap-3">
                <Label htmlFor="firstName">First Name*</Label>
                <Input
                  id="firstName"
                  type="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                  className="input-field"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="lastName">Last Name*</Label>
                <Input
                  id="lastName"
                  type="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                  className="input-field"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  // type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password*</Label>
                <Input
                  id="confirmPassword"
                  // type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="input-field"
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-4 rounded-xl" disabled={loading && formData.confirmPassword !== formData.password}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Creating account..." : "Create account"}
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
                onClick={() => {
                  CookieUtils.clear();
                  window.location.href =
                    "https://crm-backend-7lf9.onrender.com/api/auth/google";
                  // "http://localhost:3000/api/auth/google";
                }}
                className={cn(
                  "w-full flex items-center justify-center gap-2 hover:bg-gray-50 rounded-xl",
                )}
              >
                <div>
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
                </div>
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
            <div className="flex justify-center mt-4 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="ml-1 font-medium text-primary hover:underline"
              >
                Log in
              </Link>
            </div>
          </div>


        </div>
      </div>
    </Section >
  );
}
