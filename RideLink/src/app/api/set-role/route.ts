import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }
  const user = await currentUser();
  if (!user) {
    return NextResponse.redirect("/sign-in");
  }
  const formData = await req.formData();
  const role = formData.get("role");
  if (role !== "driver" && role !== "passenger") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  await user.update({ publicMetadata: { ...user.publicMetadata, role } });
  if (role === "driver") {
    return NextResponse.redirect("/driver");
  } else {
    return NextResponse.redirect("/passenger");
  }
}
