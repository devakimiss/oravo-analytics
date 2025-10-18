import { NextRequest } from 'next/server';
import { json, badRequest, notFound } from '@/lib/response';
import prisma from '@/lib/prisma';
import { sendEmail, generateWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return badRequest('Verification token is required');
    }

    // Find user with this verification token
    const user = await prisma.client.user.findFirst({
      where: {
        verificationToken: token,
        emailVerified: false,
      },
    });

    if (!user) {
      return notFound('Invalid or expired verification token');
    }

    // Check if token is expired (24 hours)
    const tokenAge = Date.now() - new Date(user.createdAt).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (tokenAge > twentyFourHours) {
      return badRequest('Verification token has expired');
    }

    // Update user as verified
    await prisma.client.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });

    // Send welcome email
    if (user.email) {
      const { html, text } = generateWelcomeEmail(user.username);
      await sendEmail({
        to: user.email,
        subject: 'Welcome to Oravo - Email Verified! 🎉',
        html,
        text,
      });
    }

    return json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    return badRequest('Failed to verify email');
  }
}
