import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default function SignInForm({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push("/manage");
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white/70 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-white/80 shadow-2xl shadow-black/5 space-y-7">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Sign in to continue to your workspace</p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() =>
              authClient.signIn.social({
                provider: "google",
                callbackURL: "/manage",
              })
            }
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow group"
          >
            <GoogleIcon />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() =>
              authClient.signIn.social({
                provider: "facebook",
                callbackURL: "/manage",
              })
            }
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-[#1877F2]/5 hover:border-[#1877F2]/30 transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow group"
          >
            <FacebookIcon />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1877F2]">Continue with Facebook</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white/70 backdrop-blur-sm px-4 text-muted-foreground font-medium uppercase tracking-widest">or continue with email</span>
          </div>
        </div>

        {/* Email Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          <div className="space-y-4">
            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary/30 transition-all placeholder:text-gray-300"
                    placeholder="you@example.com"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-destructive text-xs font-medium">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary/30 transition-all placeholder:text-gray-300"
                    placeholder="••••••••"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-destructive text-xs font-medium">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                className="w-full h-12 text-sm font-bold rounded-xl bg-primary hover:brightness-110 shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <MailIcon />
                    Sign In with Email
                  </span>
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToSignUp}
              className="text-secondary hover:text-secondary/80 font-bold transition-colors underline underline-offset-4 decoration-secondary/30 hover:decoration-secondary/60"
            >
              Create one
            </button>
          </p>
        </div>
      </div>

      {/* Terms */}
      <p className="text-center text-[11px] text-muted-foreground/60 mt-6 px-8 leading-relaxed">
        By signing in, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
