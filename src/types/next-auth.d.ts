import { Role } from "@/types/enums";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: Role | string;
    phone?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: Role | string;
      phone?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role | string;
    phone?: string | null;
  }
}
