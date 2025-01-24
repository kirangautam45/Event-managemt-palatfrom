import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import AuthForm from '@/components/AuthForm'
import { getServerSession } from 'next-auth'

const Login = async() => {
  const session = await getServerSession(authOptions)
  console.log('Server-side session:', session)
  return (
    <section className='flex-center size-full max-sm:px-6'>
      <AuthForm type='sign-in' />
    </section>
  )
}

export default Login
