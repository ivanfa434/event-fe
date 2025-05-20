"use client";

import { cn } from "@/lib/utils";
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
import { useFormik } from "formik";
import { RegisterSchema } from "../schema";
import useRegister from "@/hooks/api/auth/useRegister";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { mutateAsync: register, isPending } = useRegister();

    const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      referralCodeUsed: "",
      role: "USER"
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      await register(values);
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
  <Card>
    <CardHeader>
      <CardTitle className="text-2xl">Register</CardTitle>
      <CardDescription>
        Enter your information below to register your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-6">
          {/* Full Name */}
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Your Full Name"
              required
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.fullName && !!formik.errors.fullName && (
              <p className="text-xs text-red-500">{formik.errors.fullName}</p>
            )}
          </div>

          {/* Email */}
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
            />
            {formik.touched.email && !!formik.errors.email && (
              <p className="text-xs text-red-500">{formik.errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="Your Phone Number"
              required
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phoneNumber && !!formik.errors.phoneNumber && (
              <p className="text-xs text-red-500">{formik.errors.phoneNumber}</p>
            )}
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Your Password"
              required
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && !!formik.errors.password && (
              <p className="text-xs text-red-500">{formik.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Your Password"
              required
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword && !!formik.errors.confirmPassword && (
              <p className="text-xs text-red-500">{formik.errors.confirmPassword}</p>
            )}
          </div>

          {/* Referral Code */}
          <div className="grid gap-2">
            <Label htmlFor="referralCodeUsed">Referral Code (Optional)</Label>
            <Input
              id="referralCodeUsed"
              name="referralCodeUsed"
              type="text"
              placeholder="Enter Referral Code"
              value={formik.values.referralCodeUsed}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.referralCodeUsed && !!formik.errors.referralCodeUsed && (
              <p className="text-xs text-red-500">{formik.errors.referralCodeUsed}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Loading" : "Register"}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
      
      <div className="mt-2 text-center text-sm">
        Want to register as an organizer?{" "}
        <Link href="/register/organizer" className="underline underline-offset-4">
          Register as Organizer
        </Link>
      </div>
    </CardContent>
  </Card>
</div>
  )
}