import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import { Adapter } from 'next-auth/adapters'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as unknown as Adapter,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const { email, password } = credentials

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            throw new Error('Invalid email or password')
          }

          const isValidPassword = await bcrypt.compare(password, user.password!)

          if (!isValidPassword) {
            throw new Error('Invalid email or password')
          }

          return {
            id: user.id,
            email: user.email,
          }
        } catch (error) {
          console.error('Authorization Error:', error)
          throw new Error('Internal server error')
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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          email: token.email,
        }
      }
      return session
    },
  },
}
