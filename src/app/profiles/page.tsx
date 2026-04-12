"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Profiles = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  const handleProfileClick = () => {
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-black text-white">
        Loading…
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex w-full h-screen justify-center items-center flex-col gap-8 bg-black">
      <h1 className="text-white text-[50.4px]">Who&apos;s watching</h1>

      <div className="flex flex-col gap-3">
         <div
           className="rounded-sm overflow-hidden cursor-pointer"
           onClick={handleProfileClick}
         >
          <Image
            src="/assets/profile.png"
            height={144}
            width={144}
            alt="Profile"
          />
        </div>

        <h3 className="text-[#e5e5e5] text-[18.72px] text-center">
          {session?.user?.name || "Loading..."}
        </h3>
      </div>
    </div>
  );
};

export default Profiles;