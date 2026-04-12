import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { connectToDB } from "./db";
const serverAuth = async () => {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session from serverAuth:", session);

    if (!session) {
      throw new Error("No session found");
    }

    await connectToDB();
    const currentUser = await User.findOne({
      email: session.user?.email,
    } as any);

    console.log("Current user:", currentUser);

    if (!currentUser) {
      throw new Error("User not found");
    }

    return { currentUser };
  } catch (error) {
    console.log("ServerAuth error:", error);
    throw error;
  }
};

export default serverAuth;