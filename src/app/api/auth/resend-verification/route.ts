import { NextRequest } from 'next/server';
import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { json, notFound } from '@/lib/response';
import prisma from '@/lib/prisma';
import { getRandomChars } from '@/lib/crypto';
import { sendEmail, generateVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  const schema = z.object({
    email: z.string().email(),
  });

  const { body, error } = await parseRequest(request, schema, { skipAuth: true });

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
    const emailResult = await sendEmail({
      to: email,
      subject: 'Verify Your Oravo Email Address',
      html,
      text,
    });

    // Log token if email not configured
    if (!emailResult.success) {
      // eslint-disable-next-line no-console
      console.log('\n=================================');
      // eslint-disable-next-line no-console
      console.log('📧 VERIFICATION EMAIL (SMTP NOT CONFIGURED)');
      // eslint-disable-next-line no-console
      console.log('=================================');
      // eslint-disable-next-line no-console
      console.log('To:', email);
      // eslint-disable-next-line no-console
      console.log('Username:', user.username);
      // eslint-disable-next-line no-console
      console.log('Verification Token:', verificationToken);
      // eslint-disable-next-line no-console
      console.log(
        'Verification URL:',
        `${process.env.APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`,
      );
      // eslint-disable-next-line no-console
      console.log('=================================\n');
    }

    return json({
      success: true,
      message: 'Verification email sent',
      emailConfigured: emailResult.success,
    });
  } catch (error) {
    return json(
      {
        error: 'Failed to resend verification email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 },
    );
  }
}
