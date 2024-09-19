import { DefaultSession } from "next-auth";

// Extend the Session type to include the accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string; 
  }
}