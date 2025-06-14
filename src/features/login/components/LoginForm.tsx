"use client";
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
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import Link from "next/link";
import { LoginSchema } from "../schema";
import useLogin from "@/hooks/api/auth/useLogin";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { mutateAsync: login, isPending } = useLogin();
  const { isLoginBlocked, getBlockRemainingTime } = useAuth();

  const isBlocked = isLoginBlocked();
  const remainingTime = getBlockRemainingTime();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      if (!isBlocked) {
        await login(values).catch(() => {
        });
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-6">
              {isBlocked && (
                <div className="rounded border border-red-400 bg-red-100 p-3 text-red-700">
                  <p>
                    Terlalu banyak percobaan gagal. Silakan coba lagi dalam{" "}
                    {remainingTime} menit.
                  </p>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isBlocked || isPending}
                />
                {formik.touched.email && !!formik.errors.email && (
                  <p className="text-xs text-red-500">{formik.errors.email}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Your Password"
                  required
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isBlocked || isPending}
                />
                {formik.touched.password && !!formik.errors.password && (
                  <p className="text-xs text-red-500">
                    {formik.errors.password}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isPending || isBlocked}
              >
                {isPending
                  ? "Loading"
                  : isBlocked
                    ? `Diblokir (${remainingTime} menit)`
                    : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Do not have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
            <div className="mt-4 text-center text-sm">
              Lupa password anda?{" "}
              <Link
                href="/forgot-password"
                className="underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
