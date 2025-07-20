'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from './logo';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, KeyRound, User, Phone, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const signupSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    mobile: z.string().min(10, { message: "Invalid mobile number." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type AuthFormProps = {
  userType: 'driver' | 'passenger';
};

export function AuthForm({ userType }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", mobile: "", password: "" },
  });

  const { dataStore } = require('@/lib/local-data');

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 700));
    const valid = dataStore.validateUserPassword(values.email, values.password, userType);
    setLoading(false);
    if (valid) {
      toast({
        title: "Login Successful",
        description: "Redirecting to your dashboard...",
      });
      router.push(`/${userType}`);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive"
      });
    }
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 700));
    // Check if user exists
    const exists = dataStore.getUserByEmailAndType(values.email, userType);
    if (exists) {
      setLoading(false);
      toast({
        title: "Signup Failed",
        description: "An account with this email already exists for this user type.",
        variant: "destructive"
      });
      return;
    }
    const created = dataStore.createUser({
      user_type: userType,
      name: values.name,
      email: values.email,
      password: values.password,
      mobile: values.mobile,
    });
    setLoading(false);
    if (created) {
      toast({
        title: "Signup Successful",
        description: "Welcome! Redirecting to your dashboard...",
      });
      router.push(`/${userType}`);
    } else {
      toast({
        title: "Signup Failed",
        description: "Could not create account. Please try again.",
        variant: "destructive"
      });
    }
  };


  const userTypeCapitalized = userType.charAt(0).toUpperCase() + userType.slice(1);

  return (
    <div className="flex flex-col items-center space-y-4">
        <Link href="/">
            <Logo />
        </Link>
        <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
            <Card>
            <CardHeader>
                <CardTitle>{userTypeCapitalized} Login</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField control={loginForm.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input type="email" placeholder="you@example.com" {...field} className="pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={loginForm.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <Button type="submit" className="w-full !mt-6" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="signup">
            <Card>
            <CardHeader>
                <CardTitle>Create {userTypeCapitalized} Account</CardTitle>
                <CardDescription>Join RideLink by filling out the form below.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                         <FormField control={signupForm.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input placeholder="John Doe" {...field} className="pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={signupForm.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input type="email" placeholder="you@example.com" {...field} className="pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={signupForm.control} name="mobile" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input placeholder="+1 234 567 890" {...field} className="pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={signupForm.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <Button type="submit" className="w-full !mt-6" disabled={loading}>
                            {loading ? "Creating account..." : "Create Account"}
                             {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            </Card>
        </TabsContent>
        </Tabs>
    </div>
  );
}
