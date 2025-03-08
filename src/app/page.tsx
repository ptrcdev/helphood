"use client";

import Link from 'next/link';
import { Heart, ArrowRight, LogOut, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import Footer from '@/components/ui/Footer';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

const Home = () => {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 md:px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-rose-500" />
            <h1 className="text-2xl font-bold text-gray-800">HelpHood</h1>
          </div>
          <div className="space-x-2">
            {status === 'unauthenticated' ? (<><Link href="/signin">
              <button className="bg-white border font-bold border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100">
                Sign In
              </button>
            </Link>
              <Link href="/signup">
                <button className="bg-gray-900 text-white font-bold border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-800">
                  Sign Up
                </button>
              </Link></>) : (
              <div className='flex items-center gap-4'>
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className='[&_svg]:size-5 hover:bg-gray-100 cursor-pointer'>
                    <User className="h-8 w-8" />
                  </Button>
                </Link>
                <button onClick={() => signOut()}>
                  <LogOut className='h-5 w-5 cursor-pointer text-rose-500 hover:text-rose-800' />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Connecting Seniors with Caring Volunteers
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            HelpHood brings together seniors who need assistance and volunteers
            who want to make a difference in their community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {
              status === 'unauthenticated' && (
                <>

                  <Link href="/request-help">
                    <button className="w-full sm:w-auto flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 cursor-pointer">
                      Request Help <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                  <Link href="/request-help">
                    <button className="w-full sm:w-auto flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300 cursor-pointer outline outline-1 outline-gray-300">
                      Start Helping <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </>

              )
            }
            {
              status === 'authenticated' && session.user?.role === 'volunteer' && (
                <Link href="/volunteer-dashboard">
                  <button className="w-full sm:w-auto flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300 cursor-pointer outline outline-1 outline-gray-300">
                    Volunteer Dashboard <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              )
            }
            {
              status === 'authenticated' && session.user?.role === 'requester' && (
                <Link href="/requester-dashboard">
                  <button className="w-full sm:w-auto flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300 cursor-pointer outline outline-1 outline-gray-300">
                    Requester Dashboard <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              )
            }
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
            How HelpHood Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    1
                  </span>
                  Sign Up
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  Create an account as someone who needs help or as a volunteer
                  willing to assist others.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    2
                  </span>
                  Connect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  Post help requests or browse available opportunities to volunteer
                  in your neighborhood.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <span className="bg-rose-100 text-rose-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    3
                  </span>
                  Help & Be Helped
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  Volunteers accept requests and provide assistance, creating
                  stronger community bonds.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;