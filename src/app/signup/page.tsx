"use client";

import { Input } from "@/shared/components/ui/Input";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await axios.post("/api/register", {
        name,
        email,
        password,
      });

      if (res.status === 201) {
        const signInResult = await signIn("credentials", {
          email: email.trim(),
          password,
          redirect: false,
        });

        if (signInResult?.error || !signInResult?.ok) {
          toast.error(signInResult?.error || "Could not sign you in");
          router.push("/login");
          return;
        }

        router.refresh();
        router.push("/profiles");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center bg-black loginContainer">
      <div className="max-w-[480px] w-full bg-[#000000d2] rounded-sm py-5 px-16 font-bold text-[2rem] text-white flex flex-col gap-5 z-50">
        <h1>SignUp</h1>

        <Input
          type="text"
          placeholder="Username"
          className="py-6 px-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          type="email"
          placeholder="Email"
          className="py-6 px-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          className="py-6 px-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="cursor-pointer w-full bg-[#e50914] text-base font-medium rounded-lg py-2.5"
          onClick={handleSignUp}
        >
          Sign Up
        </button>

        <p className="text-base text-[#ffffffeb] text-center">OR</p>

        <div className="flex items-center justify-center gap-4">
          <FcGoogle
            className="cursor-pointer w-10 h-10"
            onClick={() =>
              signIn("google", { callbackUrl: "/profiles" })
            }
          />
          <BsGithub
            className="cursor-pointer w-10 h-10"
            onClick={() =>
              signIn("github", { callbackUrl: "/profiles" })
            }
          />
        </div>

        <div>
          <span className="text-[#ffffffb3] text-base font-normal">
            Already have an account?{" "}
          </span>
          <Link href="/login" className="font-medium text-base">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;