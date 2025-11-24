"use client";

import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../AuthPage.module.css";
import type { AuthResponse, ErrorResponse } from "@/app/types/auth";

type LoginFormValues = {
  email: string;
  password: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const [formMessage, setFormMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const onSubmit = async (values: LoginFormValues) => {
    setFormMessage(null);
    try {
      const { data } = await axios.post<AuthResponse>("/api/auth/login", values);
      if (!data?.is_auth) {
        setFormMessage({ type: "error", text: "Не удалось авторизоваться" });
        return;
      }

      window.location.href = "/";
    } catch (error) {
      if (axios.isAxiosError<ErrorResponse>(error) && error.response?.data?.status) {
        setFormMessage({ type: "error", text: error.response.data.status });
      } else {
        setFormMessage({
          type: "error",
          text: "Не удалось связаться с сервером. Попробуйте ещё раз.",
        });
      }
    }
  };

  return (
    <div className={styles.authLayout}>
      <div className={styles.authCard}>
        <div className={styles.brandHeader}>
          <Image src="/vobla.png" alt="Логотип VOblako" width={52} height={52} priority />
          <div>
            <p className={styles.brandTitle}>VOblako</p>
            <p className={styles.brandSubtitle}>облачное хранилище</p>
          </div>
        </div>
        <h1 className={styles.pageHeading}>Вход в VOblako</h1>
        <p className={styles.pageDescription}>
          С возвращением! Введите почту и пароль, чтобы открыть ваше облако.
        </p>

        {formMessage && (
          <div
            className={clsx(
              styles.formMessage,
              formMessage.type === "error" ? styles.errorMessage : styles.successMessage,
            )}
            role="status"
            aria-live="polite"
          >
            {formMessage.text}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Электронная почта
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={clsx(styles.input, {
                [styles.inputError]: errors.email,
              })}
              {...register("email", {
                required: "Введите вашу почту",
                pattern: {
                  value: EMAIL_PATTERN,
                  message: "Укажите корректный адрес",
                },
              })}
            />
            {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Пароль
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={clsx(styles.input, {
                [styles.inputError]: errors.password,
              })}
              {...register("password", {
                required: "Введите пароль",
                minLength: {
                  value: 8,
                  message: "Минимум 8 символов",
                },
                maxLength: {
                  value: 32,
                  message: "Максимум 32 символа",
                },
              })}
            />
            {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className={clsx(styles.submitButton, {
              [styles.submitButtonLoading]: isSubmitting,
            })}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? "Выполняем вход…" : "Войти"}
          </button>
        </form>

        <p className={styles.linkRow}>
          Нет аккаунта?{" "}
          <Link href="/auth/signup" className={styles.link}>
            Зарегистрируйтесь
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
