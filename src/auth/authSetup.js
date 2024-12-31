import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import facebook from "next-auth/providers/facebook";
import cookies from "js-cookie";


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        facebook,
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // console.log('User signed in:', user);
            // Send POST request to localhost:3000/api/auth/sign
            try {
                const response = await fetch('https://tripma-eight.vercel.app/api/user/sign', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                });
                if (!response.ok) {
                    return false;
                }
                const data = await response.json();
                user.id = data.result._id; // Assuming your API returns `userId`
            } catch (error) {
                console.error('Error sending POST request:', error);
            }


            return true; // Return true to allow sign in
        },
        async jwt({ token, user }) {
            // Replace default JWT with your cookie ID
            if (user) {
                token.id = user.id;
            }

            // console.log("Custom JWT Token:", token);
            return token;
        },
        authorized: async ({ auth }) => {
            return !!auth;
        },
        async session({ session, token }) {
            // Add the user ID to the session
            session.user.id = token.id; // Use the custom ID from the JWT
            return session;
        },
    },
    trustHost: true,
});