"use client";
import { Input } from "@/shared/components/ui/Input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();


const handleLogin = async () => {
  try {
    const response = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    if (response?.error || !response?.ok) {
      if (response?.error === "CredentialsSignin") {
        toast.error(
          "Wrong email or password. Use Google or GitHub if you created the account that way. If you signed up a while ago and this still fails, register again — older rows may have a bad password hash."
        );
      } else {
        toast.error(response?.error || "Could not sign in. Try again.");
      }
      return;
    }

    router.refresh();
    router.push("/profiles");
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};


     return(<div
  className = "min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center bg-black loginContainer">
    <div
    className="max-w-[480px]  w-full bg-[#000000d2] rounded-sm py-5 px-16 font-bold text-[2rem] text-white  flex flex-col gap-5 z-50 ">
      <h1>Login</h1>
     
      <Input type="email" placeholder="Email" className="py-6 px-2" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <Input type="password" placeholder="Password" className="py-6 px-2" value={password}  onChange={(e) => setPassword(e.target.value) } />
      <button className="cursor-pointer w-full bg-[#e50914] text-base font-medium rounded-lg py-2.5" onClick={handleLogin}>Login</button>
     
     <p className="text-base text-[#ffffffeb] text-center">OR</p>
     <div className="flex items-center justify-center gap-4">
     <FcGoogle className="cursor-pointer w-10 h-10 " onClick={() => signIn("google" , { callbackUrl: "/profiles" })}/>
     <BsGithub className="cursor-pointer w-10 h-10 " onClick={() => signIn("github" , { callbackUrl: "/profiles" })}/>
     </div>
     <div><span className="text-[#ffffffb3] text-base font-normal">New to Netflix? {" "} </span>
     <Link href = "/signup" className="font-medium text-base">Sign Up</Link>
     </div>
     </div>
    </div>
    );

};
export default Login;
