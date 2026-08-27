import { NextResponse } from "next/server";
import { createSessionToken, credentialsSchema, hashPassword } from "@/lib/auth";
import { badRequest, parseJsonBody, serverError } from "@/lib/api";
import { findUserByEmail, saveUser } from "@/lib/auth-store";

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);

  const parsed = credentialsSchema.safeParse(body.data);
  if (!parsed.success) {
    return badRequest(parsed.error.flatten());
  }

  try {
    const email = parsed.data.email.trim().toLowerCase();
    if (findUserByEmail(email)) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const user = {
      id: crypto.randomUUID(),
      email,
      role: "RESEARCHER",
      passwordHash: await hashPassword(parsed.data.password)
    };
    saveUser(user);
    const token = await createSessionToken(user);
    const response = NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } }, { status: 201 });
    response.cookies.set("agi_session", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
    return response;
  } catch {
    return serverError("Unable to create session.");
  }
}
