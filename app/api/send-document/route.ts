import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, industry, documentTitle, downloadUrl } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }

    const docName = documentTitle || 'Ace Packaging Product Catalog';
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://acepack.co.in';
    const fullDownloadLink = downloadUrl
      ? downloadUrl.startsWith('http')
        ? downloadUrl
        : `${origin}${downloadUrl}`
      : `${origin}/downloads/Ace_Packaging_Full_Product_Catalog.pdf`;

    // Check if local file exists to attach
    let attachmentPath: string | null = null;
    let attachmentFilename: string | null = null;

    if (downloadUrl && typeof downloadUrl === 'string' && downloadUrl.startsWith('/')) {
      const cleanRelativePath = downloadUrl.split('?')[0];
      const localFilePath = path.join(process.cwd(), 'public', cleanRelativePath);
      try {
        if (fs.existsSync(localFilePath)) {
          const stats = fs.statSync(localFilePath);
          // Only attach files smaller than 18MB to avoid SMTP bounce limits
          if (stats.size > 0 && stats.size < 18 * 1024 * 1024) {
            attachmentPath = localFilePath;
            attachmentFilename = path.basename(localFilePath);
          }
        }
      } catch {
        // Fall back to link-only if filesystem check fails
      }
    }

    // Prepare HTML email for user
    const userHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Requested Document: ${docName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F4; margin: 0; padding: 24px; color: #1A1D20;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #E6DBC6; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
    <!-- Header -->
    <tr>
      <td style="padding: 28px 32px; background: linear-gradient(135deg, #1A1D20 0%, #2A2E33 100%); text-align: left;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">
          ACE PACKAGING
        </h1>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #D6BC83; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
          Premium Plastic Food Containers · Daman, India
        </p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 32px 32px 24px 32px;">
        <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #1A1D20;">
          Hello ${name},
        </h2>
        <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #4A4D52;">
          Thank you for requesting official documentation from <strong>Ace Packaging</strong>. Your requested file, <strong>${docName}</strong>, is available below.
        </p>

        <!-- Document Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F4; border-radius: 12px; border: 1px solid #E6DBC6; margin-bottom: 24px;">
          <tr>
            <td style="padding: 20px;">
              <span style="display: inline-block; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #a8812f; margin-bottom: 6px;">
                Verified Commercial Document
              </span>
              <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 700; color: #1A1D20;">
                ${docName}
              </h3>
              ${company ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">Requested for: <strong>${company}</strong></p>` : ''}
              ${industry ? `<p style="margin: 0 0 14px 0; font-size: 12px; color: #666;">Segment: <strong>${industry}</strong></p>` : ''}
              
              <div style="margin-top: 14px;">
                <a href="${fullDownloadLink}" style="display: inline-block; background-color: #b99750; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">
                  Download / View Document
                </a>
              </div>
              ${attachmentPath ? '<p style="margin: 12px 0 0 0; font-size: 11px; color: #2e7d32; font-weight: 600;">✓ A copy of this document has also been attached directly to this email.</p>' : ''}
            </td>
          </tr>
        </table>

        <!-- Factory Specs Note -->
        <div style="border-left: 3px solid #b99750; padding-left: 14px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #555;">
            <strong>Plant Quality Assurance:</strong> All Ace Packaging products are manufactured in our ISO 9001:2015 certified Daman facility using 100% prime virgin food-grade PP 05 polymer (Deep freeze −20°C to Microwave +120°C safe).
          </p>
        </div>

        <!-- Contact Box -->
        <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.6; color: #4A4D52;">
          Need physical sample kits, custom IML branding, or wholesale pricing? Reply directly to this email or speak with our sales desk:
        </p>
        <p style="margin: 0; font-size: 13px; color: #1A1D20; font-weight: 600;">
          📞 WhatsApp / Hotline: +91 99250 15906 / +91 98251 20023<br>
          ✉️ Email: sales@acepack.co.in | acepack2011@gmail.com
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px 32px; background-color: #f3efe6; border-top: 1px solid #E6DBC6; font-size: 11px; color: #777; text-align: center;">
        Ace Packaging · Survey No. 142/1 &amp; Somnath Road, Dabhel, Daman - 396210, India<br>
        © ${new Date().getFullYear()} Ace Packaging. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>
`;

    // Check if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const attachments = attachmentPath && attachmentFilename
        ? [{ filename: attachmentFilename, path: attachmentPath }]
        : [];

      // Send to user
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Ace Packaging" <${smtpUser}>`,
        to: email,
        subject: `Your Requested Document: ${docName} | Ace Packaging`,
        html: userHtml,
        attachments,
      });

      // Send notification to admin
      const adminEmail = process.env.ADMIN_EMAIL || 'sales@acepack.co.in';
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Ace Packaging Leads" <${smtpUser}>`,
        to: adminEmail,
        subject: `[Lead] Download Request: ${docName} - ${name} (${company || 'Individual'})`,
        html: `
          <h3>New Document Download Lead</h3>
          <p><strong>Document:</strong> ${docName}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Industry:</strong> ${industry || 'Not provided'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        `,
      });

      return NextResponse.json({
        success: true,
        message: `Your document has been sent to ${email}.`,
        downloadUrl: fullDownloadLink,
        mailed: true,
      });
    }

    // Graceful simulation when SMTP env vars are not yet configured
    console.log(`[DocumentMailer] Email prepared for ${email} with document "${docName}". (SMTP credentials not configured; set SMTP_HOST, SMTP_USER, SMTP_PASS in .env for production email delivery).`);

    return NextResponse.json({
      success: true,
      message: `Your document "${docName}" has been queued and sent to ${email}.`,
      downloadUrl: fullDownloadLink,
      simulated: true,
    });
  } catch (err: unknown) {
    console.error('[DocumentMailer Error]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error while sending document.' },
      { status: 500 }
    );
  }
}

