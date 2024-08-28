import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsPorvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsPorvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
        password_confirmation: { label: "Confirm Password", type: "password" },
        loginForm: { type: "hidden" },
      },
      async authorize(credentials) {
        try {
          console.log("credentials", credentials);
          const route =
            credentials.loginForm == "true"
              ? "oauth/login" // Login API route
              : "oauth/register";

          console.log("fucking route", route);

          const res = await fetch(`${process.env.API_HOST}` + route, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: credentials.name,
              email: credentials.email,
              password: credentials.password,
              password_confirmation: credentials.password_confirmation,
            }),
          });
          const data = await res.json();
          console.log("hello", data);

          if (data && data.status === "success") {
            // console.log("hello", data);
            const user = data.data.auth.user;
            const token = data.data.auth.token;

            // console.log("userr", user);
            // Return an object with user and token data
            return { ...user, accessToken: token };
          } else {
            // Handle validation errors from the API response
            if (data.errors) {
              throw new Error(JSON.stringify(data.errors)); // Convert errors to a single error object
            } else {
              // Handle other errors (e.g., network issues)
              throw new Error("An error occurred during registration");
            }
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === "google") {
        const res = await fetch(
          `${process.env.API_HOST}` + "user/google-login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email, name: user.name }),
          }
        );
        const data = await res.json();
        console.log("e data", data);
        if (data.status === "success") {
          user.enroll = data.data.auth.user.enroll;
          user.avatar = data.data.auth.user.avatar;
          user.accessToken = data.data.auth.token;
          return true;
        } else {
          return false;
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.avatar = user.avatar;
        token.enroll = user.enroll;
        // Add other user properties if needed
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.avatar = token.avatar;
      session.accessToken = token.accessToken;
      session.user.enroll = token.enroll;
      // Add other session properties if needed
      return session;
    },
  },
  session: {
    // Set the session to expire after 1 minute (60 seconds)
    maxAge: 24 * 60 * 60,
    // Re-generate the session token if the user is active (i.e., making requests) within this time
    updateAge: 24 * 60 * 60,
  },
  events: {
    async signOut(message) {
      console.log("User signed out", message);
    },
  },
  debug: true,
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
