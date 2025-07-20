'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Ride, Booking } from '@/lib/types';
import { dataStore } from '@/lib/local-data';
import { Skeleton } from './ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Calendar, Users, Route } from 'lucide-react';


interface BookedRideDetails extends Ride {
  booking_status: 'Confirmed' | 'Cancelled';
  seats_booked: number;
}

export function PassengerMyRides() {
  const [bookedRides, setBookedRides] = useState<BookedRideDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, this would come from the authenticated user
  const PASSENGER_ID = 'passenger-456'; 

  useEffect(() => {
    const fetchMyRides = () => {
      setIsLoading(true);
      const myBookings = dataStore.getBookingsByPassengerId(PASSENGER_ID);
      const rideDetails: BookedRideDetails[] = [];

      myBookings.forEach(booking => {
        const ride = dataStore.getRideById(booking.ride_id);
        if (ride) {
          rideDetails.push({
            ...ride,
            booking_status: booking.booking_status,
            seats_booked: booking.seats_booked,
          });
        }
      });

      setBookedRides(rideDetails);
      setIsLoading(false);
    };

    fetchMyRides();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Booked Rides</h1>
        <p className="text-muted-foreground">A history of all the rides you have booked.</p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        ) : bookedRides.length > 0 ? (
          bookedRides.map((ride) => (
            <Card key={ride.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 grid md:grid-cols-4 gap-4 items-center">
                <div className="md:col-span-2 flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={ride.driver_avatar_url} data-ai-hint="person" alt={ride.driver_name} />
                    <AvatarFallback>{ride.driver_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{ride.origin} to {ride.destination}</p>
                    <p className="text-sm text-muted-foreground">with {ride.driver_name}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{ride.departure_date} at {ride.departure_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{ride.seats_booked} seat(s) booked</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={ride.booking_status === 'Confirmed' ? 'default' : 'destructive'}>{ride.booking_status}</Badge>
                   <p className="text-lg font-bold">₹{(ride.price_per_seat * ride.seats_booked).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">You haven't booked any rides yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
