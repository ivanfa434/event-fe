import * as Yup from "yup";
import YupPassword from "yup-password";
YupPassword(Yup);

export const RegisterSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .required("Name is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Must contain only digits")
    .min(10, "Phone number is too short")
    .max(15, "Phone number is too long")
    .required("Phone number is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .minLowercase(1, "Password must contain at least 1 lowercase letter")
    .minUppercase(1, "Password must contain at least 1 uppercase letter")
    .minNumbers(1, "Password must contain at least 1 number")
    .minSymbols(1, "Password must contain at least 1 special character")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),

  referralCodeUsed: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .matches(
      /^[a-zA-Z0-9\-]{10,}$/,
      "Referral code must be at least 10 characters (letters, numbers, hyphens only)",
    ),
});
