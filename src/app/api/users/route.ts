import { z } from 'zod';
import { hashPassword, canCreateUser } from '@/lib/auth';
import { ROLES } from '@/lib/constants';
import { uuid, getRandomChars } from '@/lib/crypto';
import { parseRequest } from '@/lib/request';
import { unauthorized, json, badRequest } from '@/lib/response';
import { createUser, getUserByUsername } from '@/queries';
import { sendEmail, generateVerificationEmail } from '@/lib/email';
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

  // Parse request body without requiring authentication
  let body;
  try {
    body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return badRequest('Invalid request data');
    }
    body = result.data;
  } catch (e) {
    return badRequest('Invalid request body');
  }

  // Check if this is an authenticated request (admin creating user)
  // or a public signup (no auth required)
  const authHeader = request.headers.get('authorization');
  const isAuthenticatedRequest = !!authHeader;

  if (isAuthenticatedRequest) {
    // For authenticated requests, verify permissions
    const { auth } = await parseRequest(request, schema);
    if (!(await canCreateUser(auth))) {
      return unauthorized();
    }
  }

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

    // Generate verification token if email provided
    const verificationToken = email ? getRandomChars(32) : null;

    const user = await createUser({
      id: id || uuid(),
      username,
      password: hashPassword(password),
      email: email || null,
      emailVerified: email ? false : true,
      verificationToken,
      onboardingCompleted: false,
      role: role ?? ROLES.user,
    });

    // Send verification email
    if (email && verificationToken) {
      const { html, text } = generateVerificationEmail(username, verificationToken);
      await sendEmail({
        to: email,
        subject: 'Verify Your Oravo Email Address',
        html,
        text,
      });
    }

    return json(user);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : 'Failed to create user');
  }
}
