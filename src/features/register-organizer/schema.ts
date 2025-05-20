import * as Yup from "yup";
import YupPassword from "yup-password";
YupPassword(Yup);

export const RegisterOrganizerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .required("Name is required"),
    
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
    
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .minLowercase(1, "Password must contain at least 1 lowercase letter")
    .minUppercase(1, "Password must contain at least 1 uppercase letter")
    .minNumbers(1, "Password must contain at least 1 number")
    .minSymbols(1, "Password must contain at least 1 special character")
    .required("Password is required"),
    
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
    
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Must contain only digits")
    .min(10, "Phone number is too short")
    .max(15, "Phone number is too long")
    .required("Phone number is required"),
    
  npwp: Yup.string()
    .matches(/^[0-9.-]+$/, "NPWP must contain only digits, dots, and hyphens")
    .length(20, "NPWP must be 20 characters (including dots and hyphens)")
    .required("NPWP is required"),
    
  norek: Yup.string()
    .matches(/^[0-9]+$/, "Account number must contain only digits")
    .min(10, "Account number is too short")
    .max(16, "Account number is too long")
    .required("Account number is required"),
    
  bankName: Yup.string()
    .oneOf(["BCA", "BRI", "BNI"], "Invalid bank selection")
    .required("Bank selection is required"),
    
  referralCodeUsed: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});