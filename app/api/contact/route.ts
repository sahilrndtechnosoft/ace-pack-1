import { NextRequest, NextResponse } from 'next/server';
import { getDbPool, initDb } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json().catch(() => ({}));

    const {
      name,
      email,
      phone,
      company = '',
      category = '',
      subject = '',
      message,
      source_page = '/contact',
    } = body;

    const fieldErrors: Record<string, string> = {};

    // Validate Name
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (!trimmedName) {
      fieldErrors.name = 'Full name is required.';
    } else if (trimmedName.length < 2) {
      fieldErrors.name = 'Name must be at least 2 characters long.';
    } else if (trimmedName.length > 100) {
      fieldErrors.name = 'Name cannot exceed 100 characters.';
    }

    // Validate Email
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      fieldErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(trimmedEmail)) {
      fieldErrors.email = 'Please provide a valid email address.';
    } else if (trimmedEmail.length > 255) {
      fieldErrors.email = 'Email cannot exceed 255 characters.';
    }

    // Validate Phone
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
    const phoneDigitsOnly = trimmedPhone.replace(/\D/g, '');
    if (!trimmedPhone) {
      fieldErrors.phone = 'Phone or WhatsApp number is required.';
    } else if (phoneDigitsOnly.length < 7) {
      fieldErrors.phone = 'Please provide a valid phone number (min 7 digits).';
    } else if (trimmedPhone.length > 30) {
      fieldErrors.phone = 'Phone number is too long.';
    }

    // Validate Message
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';
    if (!trimmedMessage) {
      fieldErrors.message = 'Please enter your message or inquiry requirements.';
    } else if (trimmedMessage.length < 5) {
      fieldErrors.message = 'Message must be at least 5 characters long.';
    } else if (trimmedMessage.length > 5000) {
      fieldErrors.message = 'Message cannot exceed 5000 characters.';
    }

    // Optional field constraints
    const trimmedCompany = typeof company === 'string' ? company.trim().substring(0, 200) : '';
    const trimmedCategory = typeof category === 'string' ? category.trim().substring(0, 150) : '';
    const trimmedSubject = typeof subject === 'string' ? subject.trim().substring(0, 255) : '';
    const trimmedSource = typeof source_page === 'string' ? source_page.trim().substring(0, 255) : '/contact';

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          error: 'Please correct the highlighted errors.',
          fieldErrors,
        },
        { status: 400 }
      );
    }

    // Extract Client Metadata
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : (request.headers.get('x-real-ip') || 'unknown');
    const userAgent = request.headers.get('user-agent') || '';
    // Visitor cookie set by SiteVisitorTracker; client-controlled, so only accept the expected format.
    const rawVisitorId = request.cookies.get('ace_vid')?.value || '';
    const visitorId = /^vid_[a-z0-9]{4,20}_[a-z0-9]{4,40}$/.test(rawVisitorId) ? rawVisitorId : null;

    const id = 'cnt_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const db = getDbPool();

    await db.query(
      `INSERT INTO contact_submissions 
       (id, name, email, phone, company, category, subject, message, source_page, status, ip_address, user_agent, visitor_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'unread', ?, ?, ?, NOW(), NOW())`,
      [
        id,
        trimmedName,
        trimmedEmail,
        trimmedPhone,
        trimmedCompany,
        trimmedCategory,
        trimmedSubject,
        trimmedMessage,
        trimmedSource,
        ipAddress,
        userAgent,
        visitorId,
      ]
    );

    // Optional SMTP Notification (non-blocking)
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user: smtpUser, pass: smtpPass },
        });

        const adminRecipient = process.env.ADMIN_EMAIL || 'sales@acepack.co.in';
        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Ace Packaging Leads" <${smtpUser}>`,
          to: adminRecipient,
          subject: `[New Inquiry] ${trimmedName} (${trimmedCompany || 'Individual'}) - ${trimmedCategory || 'General Inquiry'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #b99750; margin-top: 0;">New Factory Inquiry Received</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Full Name:</td><td>${trimmedName}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Company:</td><td>${trimmedCompany || 'N/A'}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td><a href="mailto:${trimmedEmail}">${trimmedEmail}</a></td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td><a href="tel:${trimmedPhone}">${trimmedPhone}</a></td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Category:</td><td>${trimmedCategory || 'General'}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Source:</td><td>${trimmedSource}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Date:</td><td>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
              </table>
              <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-left: 4px solid #b99750; border-radius: 4px;">
                <strong>Requirements / Message:</strong>
                <p style="white-space: pre-wrap; margin-top: 8px; color: #334155;">${trimmedMessage}</p>
              </div>
              <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">IP Address: ${ipAddress} | Ace Packaging CMS Automated Notification</p>
            </div>
          `,
        });
      } catch (mailErr) {
        console.warn('[ContactMailer] Could not send email notification:', mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been successfully received. Our packaging specialists will contact you shortly.',
      id,
    });
  } catch (err: any) {
    console.error('POST /api/contact error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while saving your inquiry. Please try again or reach us directly via phone.' },
      { status: 500 }
    );
  }
}
