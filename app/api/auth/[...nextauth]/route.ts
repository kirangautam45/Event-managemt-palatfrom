import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import { Adapter } from 'next-auth/adapters'
import { UserRole } from '@prisma/client'

interface CustomUser {
  id: string
  email: string
  role: UserRole
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const { email, password } = credentials

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            console.error(`User not found: ${email}`)
            return null
          }

          const isValidPassword = await bcrypt.compare(password, user.password!)

          if (!isValidPassword) {
            console.error(`Invalid password for user: ${email}`)
            return null
          }

          return {
            id: user.id,
            role: user.role,
            email: user.email,
          }
        } catch (error) {
          console.error('Error during authentication:', error)
          throw new Error('An error occurred during login')
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      console.log(session, 'session')
      if (session.user) {
        session.user.email = token.email as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        
        path: '/',
      },
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
