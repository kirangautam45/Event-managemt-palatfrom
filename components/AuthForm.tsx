'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// assuming custom actions to handle Prisma logic
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Form, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import CustomInput from './CustomInput' // Custom input component
import { authFormSchema } from '@/lib/utils' // Adjust schema for validation
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { signIn, signUp } from '@/lib/actions/user.action'
import { UserRole } from '@prisma/client'

const AuthForm = ({ type }: { type: 'sign-in' | 'sign-up' }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Define the form schema type for sign-up or sign-in
  const formSchema = authFormSchema()

  // Setup the form using react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      role: UserRole.USER,
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    try {
      if (type === 'sign-up') {
        // Handle sign-up
        const newUser = await signUp({
          email: data.email,
          role: data.role || UserRole.USER,
          password: data.password,
        })

        console.log(newUser, 'newUser')
        if (newUser) {
          router.push('/') // Redirect after successful sign-up
        }
      }

      if (type === 'sign-in') {
        // Handle sign-in with NextAuth
        const response = await signIn({
          email: data.email,
          password: data.password,
        })

        if (response?.error) {
          alert(`Sign-in failed, please try again ${response?.error}`)
        } else {
          router.push('/') // Redirect after successful sign-in
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='flex min-h-screen w-full max-w-[420px] flex-col justify-center gap-5 py-10 md:gap-8;'>
      <header>
        <h1 className=' font-extrabold'>
          {type === 'sign-in' ? 'Log In' : 'Sign Up'}
        </h1>
        <p className='my-8'>
          {type === 'sign-in'
            ? 'Please enter your credentials'
            : 'Please provide your details'}
        </p>
      </header>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 flex flex-col'
        >
          <CustomInput
            control={form.control}
            name='email'
            label='Email'
            placeholder='Enter your email'
          />

          <CustomInput
            control={form.control}
            name='password'
            label='Password'
            placeholder='Enter your password'
          />
          {/* {type === 'sign-up' && (
            <Controller
              control={form.control}
              name='role'
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a role' />
                  </SelectTrigger>
                  <SelectContent className='bg-white z-30'>
                    <SelectGroup className='z-10'>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={UserRole.USER}>User</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          )} */}
          {type === 'sign-up' && (
            <div className='flex flex-col gap-1.5'>
              <FormLabel className='text-14 w-full max-w-[280px] font-medium text-gray-700'>
                Role
              </FormLabel>
              <Controller
                control={form.control}
                name='role'
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a role' />
                    </SelectTrigger>
                    <SelectContent className='bg-white z-30'>
                      <SelectGroup className='z-10'>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRole.USER}>User</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          <div className='flex flex-col gap-4'>
            <Button
              type='submit'
              disabled={isLoading}
              className='text-16 rounded-lg border  font-semibold text-white bg-blue-500 '
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className='animate-spin' /> Loading...
                </>
              ) : type === 'sign-in' ? (
                'Sign In'
              ) : (
                'Sign Up'
              )}
            </Button>
          </div>
        </form>
      </Form>

      <footer className='flex justify-center gap-1'>
        <p>
          {type === 'sign-in'
            ? "Don't have an account?"
            : 'Already have an account?'}
        </p>
        <Link href={type === 'sign-up' ? '/login' : '/sign-up'}>
          {type === 'sign-in' ? 'Sign up' : 'Login In'}
        </Link>
      </footer>
    </section>
  )
}

export default AuthForm
