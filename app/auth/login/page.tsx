import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "VOblako — Вход",
};

const LoginPage = () => <LoginForm />;

export default LoginPage;
