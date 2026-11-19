import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 день, як і термін життя токена бекенду
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        token: { label: 'Google Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password, token } = credentials;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        try {
          let response: Response;
          if (token) {
            response = await fetch(`${apiUrl}/auth/google-login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            });
          } else {
            response = await fetch(`${apiUrl}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });
          }

          // Бекенд повертає { user: { id, name, email }, accessToken }
          const data = await response.json();

          if (!response.ok || !data?.accessToken) {
            console.error('Auth error details:', data);
            return null;
          }

          return {
            id: String(data.user.id),
            name: data.user.name,
            email: data.user.email,
            accessToken: data.accessToken, // JWT бекенду
          } as any;
        } catch (error) {
          console.error('Connection error to Backend:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // user є лише в момент входу
      if (user) {
        token.id = user.id;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
