
'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ArrowRight, Clock, MapPin, Search, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { Ride } from '@/lib/types';
import { dataStore } from '@/lib/local-data';

export function PassengerDashboard() {
  const [allRides, setAllRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchAndFilterRides = (source?: string, destination?: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
        let upcomingRides = dataStore.getRides().filter(ride => ride.status === 'Upcoming');
        setAllRides(upcomingRides);

        let ridesToDisplay = upcomingRides;
        if (source) {
          ridesToDisplay = ridesToDisplay.filter(ride => ride.origin.toLowerCase().includes(source.toLowerCase()));
        }
        if (destination) {
          ridesToDisplay = ridesToDisplay.filter(ride => ride.destination.toLowerCase().includes(destination.toLowerCase()));
        }
        
        const ridesWithCorrectedSeats = ridesToDisplay.map(ride => {
            const bookings = dataStore.getBookingsForRide(ride.id);
            const bookedSeats = bookings.reduce((acc, b) => acc + b.seats_booked, 0);
            const remainingSeats = ride.available_seats - bookedSeats;
            return { ...ride, available_seats: remainingSeats };
        });

        setFilteredRides(ridesWithCorrectedSeats);
        setIsLoading(false);
    }, 100);
  };

  useEffect(() => {
    fetchAndFilterRides();
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const source = formData.get('source') as string;
    const destination = formData.get('destination') as string;
    fetchAndFilterRides(source, destination);
  };

  const handleBookClick = (ride: Ride) => {
    setSelectedRide(ride);
    setSeatsToBook(1);
    setIsBookingModalOpen(true);
  };

  const handleBookRide = () => {
    if (!selectedRide) return;
    
    setIsBookingModalOpen(false);
    
    toast({
      title: "Booking in progress...",
      description: `We are confirming your ${seatsToBook} seat${seatsToBook > 1 ? 's' : ''}.`
    });

    setTimeout(() => {
      const booking = dataStore.createBooking({
        ride_id: selectedRide.id,
        passenger_id: 'passenger-456',
        seats_booked: seatsToBook
      });

      if (booking) {
        toast({
          title: "Ride Booked!",
          description: `Your ${seatsToBook} seat${seatsToBook > 1 ? 's have' : ' has'} been confirmed. Check 'My Rides' for details.`
        });
        const source = (document.querySelector('input[name="source"]') as HTMLInputElement)?.value;
        const destination = (document.querySelector('input[name="destination"]') as HTMLInputElement)?.value;
        fetchAndFilterRides(source, destination);
      } else {
        toast({
          title: "Booking Failed",
          description: "Could not book ride. There may not be enough seats available.",
          variant: "destructive"
        });
      }
    }, 500);
  };


  const renderMainContent = () => (
    <div className="space-y-8">
        <Card>
            <form onSubmit={handleSearch}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Find Your Next Ride</CardTitle>
                      <CardDescription>Enter your pickup and drop-off locations to see available rides.</CardDescription>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => fetchAndFilterRides()}>
                      Refresh
                    </Button>
                  </div>
              </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative w-full h-48">
  {(() => {
    try {
      // Try to require the image
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const imgSrc = require("@/../screenshot/image1.jpg");
      return (
        <>
          <Image
            src={imgSrc}
            alt="Route map placeholder"
            data-ai-hint="map city pattern"
            fill
            className="object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
        </>
      );
    } catch (e) {
      // Fallback if image is not found
      return (
        <div className="flex items-center justify-center h-full w-full bg-muted rounded-lg">
          <span className="text-muted-foreground">Map preview not available</span>
        </div>
      );
    }
  })()}
</div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input name="source" placeholder="Source location" className="pl-10" />
                        </div>
                         <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input name="destination" placeholder="Destination location" className="pl-10" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                     <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isLoading}>
                        <Search className="mr-2 h-5 w-5" />
                        {isLoading ? 'Searching...' : 'Search for Rides'}
                    </Button>
                </CardFooter>
            </form>
        </Card>

        <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Available Rides</h2>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {isLoading ? (
                    <>
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </>
                ) : filteredRides.length > 0 ? (
                    filteredRides.map((ride) => (
                        <Card key={ride.id} className="flex flex-col transition-shadow duration-300 hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center gap-4">
                               <Avatar className="h-12 w-12">
                                   <AvatarImage src={ride.driver_avatar_url} data-ai-hint="person" alt={ride.driver_name} />
                                   <AvatarFallback>{ride.driver_name.charAt(0)}</AvatarFallback>
                               </Avatar>
                               <div>
                                   <CardTitle>{ride.driver_name}</CardTitle>
                                   <CardDescription>Experienced Driver</CardDescription>
                               </div>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm">{ride.origin}</p>
                                        <p className="text-xs text-muted-foreground">To</p>
                                        <p className="font-semibold text-sm">{ride.destination}</p>
                                    </div>
                                </div>
                               <Separator />
                               <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{ride.departure_date} at {ride.departure_time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>{ride.available_seats} seats left</span>
                                    </div>
                               </div>
                            </CardContent>
                            <CardFooter className="flex-col items-stretch gap-2 !pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Price</span>
                                  <span className="text-2xl font-bold text-primary">₹{ride.price_per_seat.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <Button 
                                  className="w-full mt-2" 
                                  onClick={() => handleBookClick(ride)} 
                                  disabled={ride.available_seats <= 0}
                                >
                                  {ride.available_seats <= 0 ? 'Full' : 'Book Now'}
                                  {ride.available_seats > 0 && <ArrowRight className="ml-2 h-5 w-5" />}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <Card className="lg:col-span-2 xl:col-span-3">
                         <CardContent className="p-8 text-center text-muted-foreground">
                           No available rides match your search. Try different locations or clear your search.
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    </div>
  );

  // Booking Confirmation Modal
  const renderBookingModal = () => {
    if (!selectedRide) return null;

    return (
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>
              Select the number of seats you'd like to book for this ride.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="seats">Number of Seats: {seatsToBook}</Label>
                <span className="text-sm text-muted-foreground">
                  Max: {selectedRide.available_seats} available
                </span>
              </div>
              <Slider
                id="seats"
                min={1}
                max={Math.min(selectedRide.available_seats, 10)}
                step={1}
                value={[seatsToBook]}
                onValueChange={(value) => setSeatsToBook(value[0])}
                className="w-full"
              />
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Price per seat:</span>
                <span className="font-medium">₹{selectedRide.price_per_seat.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Number of seats:</span>
                <span className="font-medium">{seatsToBook}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t mt-2">
                <span>Total:</span>
                <span>₹{(selectedRide.price_per_seat * seatsToBook).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookRide} type="button">
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      {renderMainContent()}
      {renderBookingModal()}
    </>
  );
}

export default PassengerDashboard;