import type { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "VOblako — Регистрация",
};

const SignupPage = () => <SignupForm />;

export default SignupPage;
