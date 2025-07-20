import { DashboardLayout } from '@/components/dashboard-layout';
import { DriverDashboard } from '@/components/driver-dashboard';

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function DriverPage() {
  return (
    <DashboardLayout userType="driver">
      <DriverDashboard />
    </DashboardLayout>
  );
}
