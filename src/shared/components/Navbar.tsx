// "use client";

// import Image from "next/image";
// import { signOut } from "next-auth/react";
// import { useSession } from "next-auth/react";
// import { Sparkles } from "lucide-react";

// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
// } from "./DropdownMenu";
// import { useState } from "react";

// const Navbar = () => {
//   const { data: session } = useSession();
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isNetflixGPTModalOpen, setIsNetflixGPTModalOpen] = useState(false);

//   return (
//     <div className="flex justify-between items-center p-5">

//       {/* LEFT SIDE */}
//       <div className="flex gap-8 items-center">
//         <h1 className="text-[#e50914] cursor-pointer text-[25px] font-bold">
//           Netflix
//         </h1>

//         <ul className="flex text-sm gap-5">
//           <li className="text-[#e5e5e5] cursor-pointer hover:text-[#b3b3b3] transition-colors">
//             Home
//           </li>
//           <li className="text-[#e5e5e5] cursor-pointer hover:text-[#b3b3b3] transition-colors">
//             Shows
//           </li>
//           <li className="text-[#e5e5e5] cursor-pointer hover:text-[#b3b3b3] transition-colors">
//             Movies
//           </li>
//           <li className="text-[#e5e5e5] cursor-pointer hover:text-[#b3b3b3] transition-colors">
//             Games
//           </li>
//         </ul>
//       </div>

//     <div className="flex gap-[15px] items-center">
//       <button className="cursor-pointer">
//         <Sparkles className="text-white" />
//       </button>

//         <Image
//           src="/assets/search.svg"
//           className="cursor-pointer"
//           width={24}
//           height={24}
//           alt="Search"
//         />

//         {/* NOTIFICATION */}
//         <Image
//           src="/assets/notification.svg"
//           className="cursor-pointer"
//           width={24}
//           height={24}
//           alt="Notification"
//         />

//         {/* PROFILE DROPDOWN */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <button className="text-white cursor-pointer">
//               <Image
//                 src="/assets/profile.png"
//                 height={32}
//                 width={32}
//                 alt="Profile"
//                 className="rounded-[4px]"
//               />
//             </button>
//           </DropdownMenuTrigger>

//           <DropdownMenuContent className="bg-[#000000e6] text-white border-none w-56">

//             <DropdownMenuGroup>
//               <DropdownMenuItem className="flex gap-2 items-center">
//                 <Image
//                   src="/assets/profile.png"
//                   height={32}
//                   width={32}
//                   alt="Profile"
//                   className="rounded-[4px]"
//                 />
//                 <span>{session?.user?.name}</span>
//               </DropdownMenuItem>
//             </DropdownMenuGroup>

//             <DropdownMenuSeparator className="bg-[#ffffff40]" />

//             <DropdownMenuGroup>
//               <DropdownMenuItem
//                 className="text-[13px] px-2.5 py-2 flex justify-between"
//                 onClick={() => signOut()}
//               >
//                 Sign out of Netflix
//               </DropdownMenuItem>
//             </DropdownMenuGroup>

//           </DropdownMenuContent>
//         </DropdownMenu>

//       </div>
//     </div>
//   );
// };

// export default Navbar;
"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import NetflixGPTModal from "../components/NetflixGPTModal";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./DropdownMenu";

const Navbar = () => {
  const { data: session } = useSession();
const[isScrolled, setIsScrolled] = useState(false);
  const [isNetflixGPTModalOpen, setIsNetflixGPTModalOpen] = useState(false);

  return (
    <div className="flex justify-between items-center p-5">

      {/* LEFT SIDE */}
      <div className="flex gap-8 items-center">
        <h1 className="text-[#e50914] cursor-pointer text-[25px] font-bold">
          Netflix
        </h1>

        <ul className="flex text-sm gap-5">
          <li className="text-[#e5e5e5] cursor-pointer hover:text-[#b3b3b3]">
            Home
          </li>
          <li className="text-[#e5e5e5] cursor-pointer hover:text-[#b3b3b3]">
            Shows
          </li>
          <li className="text-[#e5e5e5] cursor-pointer hover:text-[#b3b3b3]">
            Movies
          </li>
          <li className="text-[#e5e5e5] cursor-pointer hover:text-[#b3b3b3]">
            Games
          </li>
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex gap-[15px] items-center">

        {/* ✨ GPT BUTTON */}
        <button
          className="cursor-pointer"
          onClick={() => setIsNetflixGPTModalOpen(true)}
        >
          <Sparkles className="text-white" />
        </button>

        {/* SEARCH */}
        <Image
          src="/assets/search.svg"
          width={24}
          height={24}
          alt="Search"
          className="cursor-pointer"
        />

        {/* NOTIFICATION */}
        <Image
          src="/assets/notification.svg"
          width={24}
          height={24}
          alt="Notification"
          className="cursor-pointer"
        />

        {/* PROFILE DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="cursor-pointer">
              <Image
                src="/assets/profile.png"
                width={32}
                height={32}
                alt="Profile"
                className="rounded-[4px]"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-[#000000e6] text-white border-none w-56">

            <DropdownMenuGroup>
              <DropdownMenuItem className="flex gap-2 items-center">
                <Image
                  src="/assets/profile.png"
                  width={32}
                  height={32}
                  alt="Profile"
                  className="rounded-[4px]"
                />
                <span>{session?.user?.name}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-[#ffffff40]" />

            <DropdownMenuGroup>
              <DropdownMenuItem
                className="text-[13px] px-2.5 py-2"
                onClick={() =>
                  signOut({ callbackUrl: "/login", redirect: true })
                }
              >
                Sign out of Netflix
              </DropdownMenuItem>
            </DropdownMenuGroup>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 🔥 NETFLIX GPT MODAL */}
      {isNetflixGPTModalOpen ? (
        <NetflixGPTModal
          isNetflixGPTModalOpen={isNetflixGPTModalOpen}
          setIsNetflixGPTModalOpen={setIsNetflixGPTModalOpen}
        />
      ) : null}
    </div>
  );
};

export default Navbar;
