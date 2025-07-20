import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';

export default function Page() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Map background"
          data-ai-hint="map city pattern"
          fill
          style={{objectFit: "cover"}}
          className="opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <Logo className="text-4xl" iconClassName="h-10 w-10" />
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Your modern, interactive, and responsive ride-sharing platform. Share rides to the same destination to reduce cost and pollution.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <Link href="/passenger/login" passHref>
            <Card className="transform cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">I'm a Passenger</CardTitle>
                <CardDescription>Find and book rides to your destination.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="lg" className="w-full">
                  Find a Ride
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/driver/login" passHref>
            <Card className="transform cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">I'm a Driver</CardTitle>
                <CardDescription>Offer rides and earn money on your trips.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="lg" className="w-full" variant="secondary">
                  Offer a Ride
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
