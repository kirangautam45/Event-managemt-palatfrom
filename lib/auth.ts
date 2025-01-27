import { PrismaAdapter } from '@auth/prisma-adapter'
import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { Adapter } from 'next-auth/adapters'
import { UserRole } from '@prisma/client'
declare module 'next-auth' {
  interface User {
    id: string
    email: string
    role: UserRole // Import UserRole from @prisma/client
  }

  interface Session {
    user: {
      id: string
      email: string
    }
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as unknown as Adapter,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password')
        }

        const { email, password } = credentials

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            throw new Error('No user found with that email')
          }

          const isValidPassword = await bcrypt.compare(password, user.password!)

          if (!isValidPassword) {
            throw new Error('Invalid password')
          }

          console.log('Authorization successful for user:', user.email)
          return {
            id: user.id,
            email: user.email,
            role: user.role, // You can add more fields here if needed
          }
        } catch (error) {
          console.error('Authorization Error:', error)
          throw new Error('Internal server error')
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 1* 24 * 60 * 60, // 1 days
  },
  pages: {
    signIn: '/login',  // Specify your custom login page
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback, user:', user, 'token:', token)
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = user.role // Add role if needed
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback, session:', session, 'token:', token)
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
        }
      }
      return session
    },
  },
}
