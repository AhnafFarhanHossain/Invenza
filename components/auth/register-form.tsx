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
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        } else if (value.trim().length > 50) {
          error = "Name must be less than 50 characters";
        } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          error = "Name can only contain letters, spaces, hyphens, and apostrophes";
        }
        break;
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
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (value.length > 128) {
          error = "Password must be less than 128 characters";
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(value)) {
          error = "Password must contain at least one number";
        } else if (!/(?=.*[@$!%*?&])/.test(value)) {
          error = "Password must contain at least one special character (@$!%*?&)";
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
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };
    
    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true });
    
    if (Object.values(newErrors).some(error => error !== "")) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post("/api/auth/register", formData);
      
      // Store user data in localStorage
      if (response.data.user) {
        localStorage.setItem('userEmail', response.data.user.email);
        localStorage.setItem('userName', response.data.user.name);
      }
      
      toast.success("Registration successful!");
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Registration failed. Please try again.");
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
          <CardTitle className="text-2xl font-medium">
            Create an account
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Get started with Invenza
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-8 pb-8">
          <div className="space-y-1">
            <Input
              id="name"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName("name")}
              aria-invalid={errors.name && touched.name ? "true" : "false"}
              aria-describedby="name-error"
            />
            {errors.name && touched.name && (
              <p id="name-error" className="text-xs text-red-600 mt-1 px-0">
                {errors.name}
              </p>
            )}
          </div>
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
            {formData.password && !errors.password && touched.password && (
              <p className="text-xs text-green-600 mt-1 px-0">
                Password meets all requirements
              </p>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-sm bg-primary hover:bg-primary/90 transition-colors mt-4"
            disabled={isSubmitting || Object.values(errors).some(error => error !== "")}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
