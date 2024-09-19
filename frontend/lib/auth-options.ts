import { NextAuthOptions } from "next-auth";
import { Account, Session, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,  // Ensure this matches Flask's secret
    // Optionally specify the signing algorithm if needed
    // signingAlgorithm: 'HS256',
  },
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      try {
        const response = await fetch(`${process.env.API_URL}/auth/oauth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXTAUTH_SECRET}`,  // Shared secret
          },
          body: JSON.stringify({
            email: user.email,
            provider: account?.provider,  // e.g., 'github' or 'linkedin'
            provider_id: account?.providerAccountId,  // provider-specific user ID
          }),
        });

        if (!response.ok) {
          console.error("Failed to sync with backend:", response.statusText);
          return false; // Prevent sign-in if backend sync fails
        }

        const data = await response.json();
        if (data.token) {
          // Attach backend token to the NextAuth token
          (user as any).backendToken = data.token;
        }

        return true; // Allow sign-in if backend sync succeeds
      } catch (error) {
        console.error("Error during signIn callback:", error);
        return false;
      }
    },
    
    async jwt({ token, user }: { token: any; user?: User | null }) {
      if (user && (user as any).backendToken) {
        token.accessToken = (user as any).backendToken;  // Store backend token
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: any }) {
      session.accessToken = token.accessToken || null;  // Pass the backend token to session
      return session;
    },
  },
};