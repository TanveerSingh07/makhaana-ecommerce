import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.hashedPassword) return null

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      // 🔗 LINK GUEST ORDERS → USER ON LOGIN
      if (user?.email && user?.id) {
        await prisma.order.updateMany({
          where: {
            email: user.email,
            userId: null,
          },
          data: {
            userId: user.id,
          },
        })
      }
      return true
    },

    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id

        // ✅ CHECK ADMIN ROLE
        const roles = await prisma.userRole.findMany({
          where: { userId: user.id },
          include: { role: true },
        })

        token.isAdmin = roles.some(
          (r) => r.role.name === "admin"
        )
      }
      return token
    },

      async session({ session, token }) {
        if (session.user && token.id) {
          session.user.id = token.id as string
          session.user.isAdmin = token.isAdmin as boolean
        }
        return session
      },
  },

  pages: {
    signIn: "/auth",
  },

  secret: process.env.NEXTAUTH_SECRET,
}
