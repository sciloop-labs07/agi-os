import { NextResponse } from "next/server";
import { createSessionToken, credentialsSchema, verifyPassword } from "@/lib/auth";
import { findUserByEmail } from "@/lib/auth-store";
import { badRequest, parseJsonBody, serverError } from "@/lib/api";

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);

  const parsed = credentialsSchema.safeParse(body.data);
  if (!parsed.success) return badRequest(parsed.error.flatten());

  try {
    const user = findUserByEmail(parsed.data.email);
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    }

    const token = await createSessionToken(user);
    const response = NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } });
    response.cookies.set("agi_session", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
    return response;
  } catch {
    return serverError("Unable to sign in.");
  }
}
