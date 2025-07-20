import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SelectRolePage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // If user already has a role, redirect to dashboard
  const role = user.publicMetadata?.role;
  if (role === "driver") redirect("/driver");
  if (role === "passenger") redirect("/passenger");

  // Simple UI for role selection
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80 }}>
      <h1>Select Your Role</h1>
      <form method="POST" action="/api/set-role" style={{ display: 'flex', gap: 20, marginTop: 40 }}>
        <button type="submit" name="role" value="driver">I'm a Driver</button>
        <button type="submit" name="role" value="passenger">I'm a Passenger</button>
      </form>
    </div>
  );
}
