import { PrismaAdapter } from '@auth/prisma-adapter'
import { AuthOptions } from 'next-auth'
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
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // Log the user and token during the jwt callback for debugging
      console.log('JWT callback, user:', user, 'token:', token)
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      // Log session and token during the session callback
      console.log('Session callback, session:', session, 'token:', token)
      if (token) {
        session.user = {
          email: token.email,
        }
      }
      return session
    },
  },
}
