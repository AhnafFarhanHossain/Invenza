"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "email" && !value) {
      error = "Email is required";
    } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Email is invalid";
    } else if (name === "password" && !value) {
      error = "Password is required";
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);

    setTouched({ email: true, password: true });
    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/auth/signin", formData);
      toast.success(response.data.message);
      router.push("/dashboard");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Sign-in failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (
    fieldName: keyof typeof errors,
    hasIcon: boolean
  ) => {
    const hasError = errors[fieldName] && touched[fieldName];
    const isValid = !errors[fieldName] && touched[fieldName];
    const baseClasses = `w-full rounded-lg border bg-gray-50 p-3 text-base text-gray-800 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 ${
      hasIcon ? "pl-12" : "pl-4"
    }`;

    if (hasError) {
      return `${baseClasses} border-red-500 ring-red-500/50 focus:border-red-500 focus:ring-red-500/50`;
    }
    if (isValid) {
      return `${baseClasses} border-green-500 ring-green-500/50 focus:border-green-500 focus:ring-green-500/50`;
    }
    return `${baseClasses} border-gray-300 focus:border-primary focus:ring-primary/50`;
  };

  const getIconColor = (fieldName: keyof typeof errors) => {
    const hasError = errors[fieldName] && touched[fieldName];
    const isValid = !errors[fieldName] && touched[fieldName];

    if (hasError) return "text-red-500";
    if (isValid) return "text-green-500";
    return "text-gray-400";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <Mail
          className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${getIconColor(
            "email"
          )}`}
        />
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getInputClassName("email", true)}
          aria-invalid={!!(errors.email && touched.email)}
        />
        {errors.email && touched.email && (
          <AlertCircle className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500" />
        )}
        {!errors.email && touched.email && (
          <CheckCircle className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
        )}
      </div>
      {errors.email && touched.email && (
        <p className="-mt-3 text-left text-sm text-red-600">{errors.email}</p>
      )}

      <div className="relative">
        <Lock
          className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${getIconColor(
            "password"
          )}`}
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getInputClassName("password", true)}
          aria-invalid={!!(errors.password && touched.password)}
        />
        {errors.password && touched.password && (
          <AlertCircle className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500" />
        )}
        {!errors.password && touched.password && (
          <CheckCircle className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
        )}
      </div>
      {errors.password && touched.password && (
        <p className="-mt-3 text-left text-sm text-red-600">
          {errors.password}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-6 text-base lg:text-lg"
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
