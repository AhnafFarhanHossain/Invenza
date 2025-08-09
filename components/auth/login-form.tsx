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
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/signin", formData);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
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
          <div className="space-y-2">
            <Input
              id="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="border-0 border-b border-gray-200 rounded-none bg-transparent px-0 py-3 focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-primary placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border-0 border-b border-gray-200 rounded-none bg-transparent px-0 py-3 focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-primary placeholder:text-gray-500"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-sm bg-primary hover:bg-primary/90 transition-colors mt-4"
          >
            Sign in
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Don’t have an account?{" "}
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
