import { DashboardLayout } from '@/components/dashboard-layout';
import { PassengerDashboard } from '@/components/passenger-dashboard';

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function PassengerPage() {
  return (
    <DashboardLayout userType="passenger">
      <PassengerDashboard />
    </DashboardLayout>
  );
}
