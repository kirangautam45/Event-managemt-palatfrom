import Header from '@/components/Header'
import SessionProvider from '@/components/SessionProvider'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  console.log('RootLayout session check:', session)

  if (!session) {
    redirect('/login')
  }

  return (
    <SessionProvider session={session}>
      <main className='flex h-screen w-full font-inter'>
        <div className='flex size-full flex-col'>
          <div className='root-layout'>
            <div>
              <Header />
            </div>
          </div>
          {children}
        </div>
      </main>
    </SessionProvider>
  )
}
