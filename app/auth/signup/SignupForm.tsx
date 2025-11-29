"use client";

import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../AuthPage.module.css";
import type { AuthResponse, ErrorResponse } from "@/app/types/auth";

type SignupFormValues = {
  email: string;
  password: string;
  password_repeat: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignupForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignupFormValues>({
    defaultValues: {
      email: "",
      password: "",
      password_repeat: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const [formMessage, setFormMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const onSubmit = async (values: SignupFormValues) => {
    setFormMessage(null);
    try {
      const { data } = await axios.post<AuthResponse>("/api/auth/signup", values);
      if (!data?.is_auth) {
        setFormMessage({ type: "error", text: "Не удалось создать аккаунт" });
        return;
      }

      router.replace("/");
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
        <h1 className={styles.pageHeading}>Регистрация в VOblako</h1>
        <p className={styles.pageDescription}>
          Создайте аккаунт, чтобы получать быстрый доступ к файлам с любого устройства.
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
            <label htmlFor="signup-email" className={styles.label}>
              Электронная почта
            </label>
            <input
              id="signup-email"
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
            <label htmlFor="signup-password" className={styles.label}>
              Пароль
            </label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              className={clsx(styles.input, {
                [styles.inputError]: errors.password,
              })}
              {...register("password", {
                required: "Придумайте пароль",
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

          <div className={styles.field}>
            <label htmlFor="signup-password-repeat" className={styles.label}>
              Повторите пароль
            </label>
            <input
              id="signup-password-repeat"
              type="password"
              autoComplete="new-password"
              className={clsx(styles.input, {
                [styles.inputError]: errors.password_repeat,
              })}
              {...register("password_repeat", {
                required: "Повторите пароль",
                validate: (value) =>
                  value === getValues("password") || "Пароли должны совпадать",
              })}
            />
            {errors.password_repeat && (
              <span className={styles.errorText}>{errors.password_repeat.message}</span>
            )}
          </div>

          <button
            type="submit"
            className={clsx(styles.submitButton, {
              [styles.submitButtonLoading]: isSubmitting,
            })}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? "Создаём аккаунт…" : "Зарегистрироваться"}
          </button>
        </form>

        <p className={styles.linkRow}>
          Уже есть аккаунт?{" "}
          <Link href="/auth/login" className={styles.link}>
            Войдите
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
