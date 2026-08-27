import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "development-secret-change-me");

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: { id: string; email: string; role: string }) {
  return new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role
  };
}
