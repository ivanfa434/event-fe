import * as Yup from "yup";
import YupPassword from "yup-password";
YupPassword(Yup);

export const RegisterSchema = Yup.object().shape({
  fullName: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^\d+$/, "Please enter only numbers"),
  password: Yup.string()
    .required("Password is required")
    .minLowercase(1)
    .minUppercase(1)
    .minNumbers(1)
    .minSymbols(1),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password must match!")
    .required("Confirm password is required"),
  referralCodeUsed: Yup.string()
    .nullable()
    .notRequired()
    .matches(/^[a-zA-Z0-9\-]{10,}$/, "Invalid referral code"),
});
