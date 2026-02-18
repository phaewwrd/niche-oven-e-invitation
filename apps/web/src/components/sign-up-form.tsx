import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-24 max-w-md animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="bg-white/50 backdrop-blur-xl p-10 rounded-3xl border border-white/60 shadow-2xl shadow-primary/5 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-serif font-black italic">Join Niche E</h1>
          <p className="text-muted-foreground font-medium text-sm italic">Begin your curated collection</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <form.Field name="name">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-6 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="Jane Doe"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-destructive text-xs italic font-medium">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-6 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="jane@example.com"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-destructive text-xs italic font-medium">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Security Code</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-6 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="••••••••"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-destructive text-xs italic font-medium">
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
                className="w-full py-7 text-lg font-black rounded-2xl bg-primary hover:brightness-110 shadow-xl shadow-primary/10 transition-all active:scale-95"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? "Creating..." : "Initialize Profile"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <div className="pt-4 text-center border-t border-border">
          <Button
            variant="link"
            onClick={onSwitchToSignIn}
            className="text-secondary hover:text-secondary/80 font-bold uppercase tracking-widest text-xs"
          >
            I Have An Account
          </Button>
        </div>
      </div>
    </div>
  );
}
