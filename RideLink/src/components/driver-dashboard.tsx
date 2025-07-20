'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ArrowRight, Car, DollarSign, MapPin, PlusCircle, Users, Route, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { Ride } from '@/lib/types';
import { dataStore } from '@/lib/local-data';

export function DriverDashboard() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchRides = () => {
    setIsLoading(true);
    // Give localStorage a moment to initialize on the client
    setTimeout(() => {
        const driverRides = dataStore.getRidesByDriverId('driver-123');
        setRides(driverRides);
        setIsLoading(false);
    }, 100);
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleCreateRide = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    
    const newRideData = {
        origin: formData.get('source') as string,
        destination: formData.get('destination') as string,
        departure_date: formData.get('date') as string,
        departure_time: formData.get('time') as string,
        available_seats: Number(formData.get('seats')),
        price_per_seat: Number(formData.get('price')),
        driver_id: 'driver-123',
        driver_name: 'Local Driver', // In a real app, this would come from the logged-in user's profile
        driver_avatar_url: 'https://placehold.co/100x100.png',
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const newRide = dataStore.createRide(newRideData);
    
    setIsSubmitting(false);

    if (newRide) {
        toast({
            title: "Ride Created!",
            description: "Your new ride has been listed for passengers."
        });
        setIsDialogOpen(false);
        (event.target as HTMLFormElement).reset();
        fetchRides(); // Re-fetch to update the driver's own dashboard
    } else {
         toast({
            title: "Error Creating Ride",
            description: "Could not create ride. Please try again.",
            variant: "destructive"
        });
    }
  };


  return (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Driver Dashboard</h1>
                <p className="text-muted-foreground">Manage your rides and earnings.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="lg" onClick={() => setIsDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Create New Ride
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Create a New Ride</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to list a new ride for passengers.
                    </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateRide} className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="source">Source</Label>
                            <Input id="source" name="source" placeholder="e.g., Downtown Central" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="destination">Destination</Label>
                            <Input id="destination" name="destination" placeholder="e.g., North Airport" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" name="date" type="date" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <Input id="time" name="time" type="time" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="seats">Available Seats</Label>
                                <Input id="seats" name="seats" type="number" placeholder="e.g., 3" required min="1" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price per Seat (₹)</Label>
                                <Input id="price" name="price" type="number" placeholder="e.g., 250.00" required min="0" step="0.01" />
                            </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancel</Button>
                          </DialogClose>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Ride"}
                          </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                 </CardHeader>
                 <CardContent>
                     <div className="text-2xl font-bold">₹{rides.reduce((total, ride) => {
                       const bookings = dataStore.getBookingsForRide(ride.id);
                       return total + bookings.reduce((sum, b) => sum + b.seats_booked * ride.price_per_seat, 0);
                     }, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                     <p className="text-xs text-muted-foreground">Updated in real-time</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Completed Rides</CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Your Rating</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">N/A</div>
                    <p className="text-xs text-muted-foreground">Based on 0 reviews</p>
                </CardContent>
            </Card>
        </div>


        <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">My Offered Rides</h2>
            <div className="space-y-4">
                {isLoading ? (
                    <>
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </>
                ) : rides.length > 0 ? (
                    rides.map((ride) => {
                        const bookings = dataStore.getBookingsForRide(ride.id);
                        const bookedSeats = bookings.reduce((acc, b) => acc + b.seats_booked, 0);

                        return (
                            <Card key={ride.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4 grid md:grid-cols-4 gap-4 items-center">
                                    <div className="md:col-span-2">
                                        <div className="flex items-center gap-3">
                                            <Route className="h-8 w-8 text-primary" />
                                            <div>
                                                <p className="font-bold">{ride.origin}</p>
                                                <span className="text-muted-foreground">to</span>
                                                <p className="font-bold">{ride.destination}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>{ride.departure_date} at {ride.departure_time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            <span>{bookedSeats}/{ride.available_seats} passengers</span>
                                        </div>
                                    </div>
                                <div className="flex flex-col items-end gap-2">
                                        <Badge variant={ride.status === 'Completed' ? 'default' : ride.status === 'Upcoming' ? 'secondary' : 'outline'}>{ride.status}</Badge>
                                        <Button variant="outline" size="sm" onClick={() => window.location.href = '/driver/my-rides'}>
                                            View Details
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                </div>
                                </CardContent>
                            </Card>
                        )
                    })
                ) : (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                           You have no rides scheduled. Create one to get started!
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    </div>
  );
}
