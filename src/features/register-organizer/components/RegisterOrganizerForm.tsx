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
import useRegisterAsOrganizer from "@/hooks/api/auth/useRegisterAsOrganizer";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import Link from "next/link";
import { RegisterOrganizerSchema } from "../schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RegisterOrganizerForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { mutateAsync: register, isPending } = useRegisterAsOrganizer();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      npwp: "",
      norek: "",
      referralCodeUsed: "",
      bankName: "",
    },
    validationSchema: RegisterOrganizerSchema,
    onSubmit: async (values) => {
      await register(values);
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register as Organizer</CardTitle>
          <CardDescription>
            Enter your information below to register as an event organizer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  required
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && !!formik.errors.name && (
                  <p className="text-xs text-red-500">{formik.errors.name}</p>
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
                  <p className="text-xs text-red-500">
                    {formik.errors.phoneNumber}
                  </p>
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
                  <p className="text-xs text-red-500">
                    {formik.errors.password}
                  </p>
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
                {formik.touched.confirmPassword &&
                  !!formik.errors.confirmPassword && (
                    <p className="text-xs text-red-500">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              {/* NPWP */}
              <div className="grid gap-2">
                <Label htmlFor="npwp">NPWP</Label>
                <Input
                  id="npwp"
                  name="npwp"
                  type="text"
                  placeholder="Your NPWP Number"
                  required
                  value={formik.values.npwp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.npwp && !!formik.errors.npwp && (
                  <p className="text-xs text-red-500">{formik.errors.npwp}</p>
                )}
              </div>

              {/* Bank Selection */}
              <div className="grid gap-2">
                <Label htmlFor="bankName">Bank</Label>
                <Select
                  name="bankName"
                  value={formik.values.bankName}
                  onValueChange={(value) =>
                    formik.setFieldValue("bankName", value)
                  }
                >
                  <SelectTrigger id="bankName">
                    <SelectValue placeholder="Select your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BCA">BCA</SelectItem>
                    <SelectItem value="BRI">BRI</SelectItem>
                    <SelectItem value="BNI">BNI</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.bankName && !!formik.errors.bankName && (
                  <p className="text-xs text-red-500">
                    {formik.errors.bankName}
                  </p>
                )}
              </div>

              {/* Account Number */}
              <div className="grid gap-2">
                <Label htmlFor="norek">Account Number</Label>
                <Input
                  id="norek"
                  name="norek"
                  type="text"
                  placeholder="Your Bank Account Number"
                  required
                  value={formik.values.norek}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.norek && !!formik.errors.norek && (
                  <p className="text-xs text-red-500">{formik.errors.norek}</p>
                )}
              </div>

              {/* Referral Code */}
              <div className="grid gap-2">
                <Label htmlFor="referralCodeUsed">
                  Referral Code (Optional)
                </Label>
                <Input
                  id="referralCodeUsed"
                  name="referralCodeUsed"
                  type="text"
                  placeholder="Enter Referral Code"
                  value={formik.values.referralCodeUsed}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.referralCodeUsed &&
                  !!formik.errors.referralCodeUsed && (
                    <p className="text-xs text-red-500">
                      {formik.errors.referralCodeUsed}
                    </p>
                  )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Loading" : "Register as Organizer"}
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
            Want to register as a regular user?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Register as User
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
