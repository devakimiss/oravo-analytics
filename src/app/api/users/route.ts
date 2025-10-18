import { z } from 'zod';
import { hashPassword, canCreateUser } from '@/lib/auth';
import { ROLES } from '@/lib/constants';
import { uuid } from '@/lib/crypto';
import { parseRequest } from '@/lib/request';
import { unauthorized, json, badRequest } from '@/lib/response';
import { createUser, getUserByUsername } from '@/queries';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const schema = z.object({
    id: z.string().uuid().optional(),
    username: z.string().max(255),
    password: z.string(),
    email: z.string().email().optional(),
    role: z
      .string()
      .regex(/admin|user|view-only/i)
      .optional(),
  });

  // Try to get authentication, but don't require it (skipAuth: true)
  const { auth, body: parsedBody, error } = await parseRequest(request, schema, { skipAuth: true });

  if (error) {
    return error();
  }

  const body = parsedBody;

  // Check if user has authentication
  // For public signup: no auth required
  // For admin creating user: check permissions
  if (auth?.user) {
    // This is an authenticated request (admin creating user)
    if (!(await canCreateUser(auth))) {
      return unauthorized();
    }
  }
  // If no auth, allow public signup (no permission check needed)

  const { id, username, password, email, role } = body;

  try {
    const existingUser = await getUserByUsername(username, { showDeleted: true });

    if (existingUser) {
      return badRequest('User already exists');
    }

    // Check if email already exists
    if (email) {
      const existingEmail = await prisma.client.user.findFirst({
        where: { email },
      });

      if (existingEmail) {
        return badRequest('Email already in use');
      }
    }

    // Email verification disabled - all users are verified immediately
    const newUser = await createUser({
      id: id || uuid(),
      username,
      password: hashPassword(password),
      email: email || null,
      emailVerified: true, // Always verified
      verificationToken: null, // No verification needed
      onboardingCompleted: false,
      role: role ?? ROLES.user,
    });

    // Return user data without password
    return json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      emailVerified: newUser.emailVerified,
      role: newUser.role,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
    return json({ error: errorMessage }, { status: 400 });
  }
}
