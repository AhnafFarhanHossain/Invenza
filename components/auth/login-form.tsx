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
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        } else if (value.length > 254) {
          error = "Email must be less than 254 characters";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        } else if (value.length > 128) {
          error = "Password must be less than 128 characters";
        }
        break;
    }

    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Real-time validation
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
    
    // Validate all fields before submission
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };
    
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    
    if (Object.values(newErrors).some(error => error !== "")) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post("/api/auth/signin", formData);
      console.log("Login response:", response);
      
      // Store user data in localStorage
      if (response.data.user) {
        localStorage.setItem('userEmail', response.data.user.email);
        localStorage.setItem('userName', response.data.user.name);
      }
      
      toast.success("Login successful!");
      // Add a small delay to ensure cookie is set
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Login failed. Please try again.");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName: string) => {
    const hasError = errors[fieldName as keyof typeof errors] && touched[fieldName as keyof typeof touched];
    const baseClasses = "border-0 border-b rounded-none bg-transparent px-0 py-3 focus-visible:ring-0 placeholder:text-gray-500 transition-colors";
    
    if (hasError) {
      return `${baseClasses} border-red-500 focus-visible:border-red-600 text-red-900 placeholder-red-400`;
    }
    
    if (touched[fieldName as keyof typeof touched] && !errors[fieldName as keyof typeof errors]) {
      return `${baseClasses} border-green-500 focus-visible:border-green-600`;
    }
    
    return `${baseClasses} border-gray-200 focus-visible:border-b-2 focus-visible:border-primary`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-[420px] bg-card/90 backdrop-blur-sm rounded-sm shadow-lg border-2 border-gray-200">
        <CardHeader className="space-y-3 px-8 pt-8 pb-2">
          <CardTitle className="text-2xl font-medium">Welcome back</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-8 pb-8">
          <div className="space-y-1">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName("email")}
              aria-invalid={errors.email && touched.email ? "true" : "false"}
              aria-describedby="email-error"
            />
            {errors.email && touched.email && (
              <p id="email-error" className="text-xs text-red-600 mt-1 px-0">
                {errors.email}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName("password")}
              aria-invalid={errors.password && touched.password ? "true" : "false"}
              aria-describedby="password-error"
            />
            {errors.password && touched.password && (
              <p id="password-error" className="text-xs text-red-600 mt-1 px-0">
                {errors.password}
              </p>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-sm bg-primary hover:bg-primary/90 transition-colors mt-4"
            disabled={isSubmitting || Object.values(errors).some(error => error !== "")}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="underline underline-offset-4"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
