'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Ride } from '@/lib/types';
import { dataStore } from '@/lib/local-data';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { Calendar, Users, Route } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

export function DriverMyRides() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRide, setEditRide] = useState<Ride | null>(null);
  const { toast } = useToast();

  // In a real app, this would come from the authenticated user
  const DRIVER_ID = 'driver-123'; 

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = () => {
    setIsLoading(true);
    const driverRides = dataStore.getRidesByDriverId(DRIVER_ID);
    setRides(driverRides);
    setIsLoading(false);
  };

  const handleViewDetail = (ride: Ride) => {
    setSelectedRide(ride);
    setEditRide(null);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    setEditRide(selectedRide);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editRide) return;
    const { name, value } = e.target;
    setEditRide({ ...editRide, [name]: name === 'available_seats' || name === 'price_per_seat' ? Number(value) : value });
  };

  const handleSaveEdit = () => {
    if (!editRide) return;
    dataStore.updateRide(editRide.id, editRide);
    toast({ title: "Ride Updated", description: "Your ride details have been updated." });
    setSelectedRide(editRide);
    setEditRide(null);
    fetchRides();
  };

  const handleDelete = () => {
    if (!selectedRide) return;
    if (window.confirm("Are you sure you want to delete this ride?")) {
      dataStore.deleteRide(selectedRide.id);
      toast({ title: "Ride Deleted", description: "Your ride has been removed." });
      setIsModalOpen(false);
      setSelectedRide(null);
      fetchRides();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRide(null);
    setEditRide(null);
  };

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Offered Rides</h1>
          <p className="text-muted-foreground">A history of all the rides you have offered.</p>
        </div>
        
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
                                  <p className="text-sm text-muted-foreground">to</p>
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
                          <p className="text-lg font-bold">₹{(bookedSeats * ride.price_per_seat).toLocaleString('en-IN', { minimumFractionDigits: 2 })} Earned</p>
                          <button className="mt-2 px-3 py-1 rounded bg-primary text-white hover:bg-primary/90 transition" onClick={() => handleViewDetail(ride)}>
                            View Detail
                          </button>
                     </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">You haven't offered any rides yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ride Details</DialogTitle>
          </DialogHeader>
          {selectedRide && !editRide && (
            <div className="space-y-2">
              <div><strong>From:</strong> {selectedRide.origin}</div>
              <div><strong>To:</strong> {selectedRide.destination}</div>
              <div><strong>Date:</strong> {selectedRide.departure_date}</div>
              <div><strong>Time:</strong> {selectedRide.departure_time}</div>
              <div><strong>Available Seats:</strong> {selectedRide.available_seats}</div>
              <div><strong>Price per Seat:</strong> ₹{selectedRide.price_per_seat.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              <div><strong>Status:</strong> {selectedRide.status}</div>
              <DialogFooter className="flex gap-2 mt-4">
                <Button variant="outline" onClick={handleEdit}>Edit</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
              </DialogFooter>
            </div>
          )}
          {editRide && (
            <form className="space-y-2" onSubmit={e => { e.preventDefault(); handleSaveEdit(); }}>
              <div>
                <label className="block mb-1">From</label>
                <Input name="origin" value={editRide.origin} onChange={handleEditChange} required />
              </div>
              <div>
                <label className="block mb-1">To</label>
                <Input name="destination" value={editRide.destination} onChange={handleEditChange} required />
              </div>
              <div>
                <label className="block mb-1">Date</label>
                <Input type="date" name="departure_date" value={editRide.departure_date} onChange={handleEditChange} required />
              </div>
              <div>
                <label className="block mb-1">Time</label>
                <Input type="time" name="departure_time" value={editRide.departure_time} onChange={handleEditChange} required />
              </div>
              <div>
                <label className="block mb-1">Available Seats</label>
                <Input type="number" name="available_seats" value={editRide.available_seats} onChange={handleEditChange} min={1} required />
              </div>
              <div>
                <label className="block mb-1">Price per Seat (₹)</label>
                <Input type="number" name="price_per_seat" value={editRide.price_per_seat} onChange={handleEditChange} min={0} step={0.01} required />
              </div>
              <DialogFooter className="flex gap-2 mt-4">
                <Button type="submit">Save</Button>
                <Button variant="secondary" onClick={() => setEditRide(null)}>Cancel</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
