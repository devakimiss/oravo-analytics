import { NextRequest } from 'next/server';
import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { json, badRequest, notFound, unauthorized } from '@/lib/response';
import prisma from '@/lib/prisma';
import { getRandomChars } from '@/lib/crypto';
import { sendEmail, generateVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  const schema = z.object({
    email: z.string().email(),
  });

  const { body, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const { email } = body;

  try {
    const user = await prisma.client.user.findFirst({
      where: {
        email,
        emailVerified: false,
      },
    });

    if (!user) {
      return notFound('User not found or email already verified');
    }

    // Generate new verification token
    const verificationToken = getRandomChars(32);

    // Update user with new token
    await prisma.client.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
      },
    });

    // Send verification email
    const { html, text } = generateVerificationEmail(user.username, verificationToken);
    await sendEmail({
      to: email,
      subject: 'Verify Your Oravo Email Address',
      html,
      text,
    });

    return json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    console.error('Error resending verification email:', error);
    return badRequest('Failed to resend verification email');
  }
}
