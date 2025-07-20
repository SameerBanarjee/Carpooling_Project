"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

type UserProfileProps = {
  userType: 'driver' | 'passenger';
};

export function UserProfile({ userType }: UserProfileProps) {
  const { toast } = useToast();
  const userTypeCapitalized = userType.charAt(0).toUpperCase() + userType.slice(1);
  const userInitial = userType.charAt(0).toUpperCase();
  
  const showToast = () => {
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
      variant: "default",
    });
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    showToast();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      <form onSubmit={handleSaveChanges}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="person portrait" />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <Button variant="outline" type="button">Change Photo</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={`${userTypeCapitalized} Name`} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={`${userType}@ridelink.com`} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" defaultValue="+1 234 567 890" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="password">Change Password</Label>
                  <Input id="password" type="password" placeholder="New Password" />
              </div>
            </div>
            <Button type="submit">Save Changes</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
