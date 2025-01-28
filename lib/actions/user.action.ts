'use server'

import { UserRole } from '@prisma/client'

import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth'
import { prisma } from '../prisma'

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      console.error('No authenticated session found')
      return null
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        events: true,
      },
    })

    if (!user) {
      console.error(`No user found for email: ${session.user.email}`)
      return null
    }

    return user
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}
export type CurrentUser = NonNullable<
  Awaited<ReturnType<typeof getCurrentUser>>
>

export const signUp = async ({
  email,
  password,
  role,
}: {
  email: string
  password: string
  role: UserRole
}) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required.')
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new Error('User already exists.')
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return {
      success: true,
      user,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      user: null,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

// export const signIn = async ({
//   email,
//   password,
// }: {
//   email: string
//   password: string
// }) => {
//   try {
//     if (!email || !password) {
//       throw new Error('Email and password are required.')
//     }

//     // Find the user by email
//     const user = await prisma.user.findUnique({
//       where: { email },
//     })

//     if (!user) {
//       throw new Error('Invalid email or password.')
//     }

//     // Compare passwords
//     const isValid = await bcrypt.compare(password, user.password)
//     if (!isValid) {
//       throw new Error('Invalid email or password.')
//     }

//     // Return user info (excluding password)
//     return {
//       success: true,
//       user: {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//       },
//       error: null,
//     }
//   } catch (error) {
//     return {
//       success: false,
//       user: null,
//       error:
//         error instanceof Error ? error.message : 'An unexpected error occurred',
//     }
//   }
// }
