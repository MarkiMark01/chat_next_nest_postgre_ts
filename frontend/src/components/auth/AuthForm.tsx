"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import GoogleButton from "./GoogleButton";

interface AuthFormProps {
  isRegister: boolean;
  setIsRegister: (value: boolean) => void;
}

export default function AuthForm({ isRegister, setIsRegister }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const toastId = toast.loading(isRegister ? "Creating account..." : "Signing in...");

    try {
      if (isRegister) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
          }
        );
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || "Registration failed");
        }
        
        toast.success("Registration successful!", { id: toastId });
      }

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/home",
      });

      if (res?.error) {
        throw new Error("Invalid email or password");
      }

      if (!isRegister) {
        toast.success("Welcome back!", { id: toastId });
      }

      resetForm();
      setTimeout(() => {
        router.push("/home");
      }, 500);

    } catch (err: any) {
      const errorMessage = err.message || "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 space-y-4"
    >
      {isRegister && (
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
      )}

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-semibold shadow-md transition-all active:scale-[0.98] disabled:bg-indigo-400 cursor-pointer"
      >
        {loading ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
      </button>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-wider">or</span>
        <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
      </div>
      
      <GoogleButton />

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
          <p className="text-red-500 dark:text-red-400 text-sm text-center">
            {error}
          </p>
        </div>
      )}
    </form>
  );
}