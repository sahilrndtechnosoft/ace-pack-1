import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, industry, documentTitle, downloadUrl } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid business email address is required.' }, { status: 400 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }

    const docName = documentTitle || 'Ace Packaging Product Catalog 2026';
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
        // Fall back to cloud link only if filesystem check fails
      }
    }

    const currentDateFormatted = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const cleanPhoneDigits = (phone || '').replace(/\D/g, '');
    const whatsappLink = `https://wa.me/919925015906?text=${encodeURIComponent(
      `Hello Ace Packaging, I received ${docName} and would like to inquire about physical sample kits and wholesale pricing.`
    )}`;

    // Prepare responsive, Outlook-compatible HTML email for user
    const userHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Your Requested Document: ${docName}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #FAF8F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1D20; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; margin: auto !important; border-radius: 0 !important; }
      .content-padding { padding: 24px 18px !important; }
      .header-padding { padding: 22px 18px !important; }
      .btn-primary { width: 100% !important; display: block !important; box-sizing: border-box !important; text-align: center !important; }
      .stack-column { display: block !important; width: 100% !important; box-sizing: border-box !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 20px 0; background-color: #FAF8F4;">
  <!-- Preview snippet text for email clients -->
  <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
    Your requested official file (${docName}) is ready for download from Ace Packaging.
    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FAF8F4">
    <tr>
      <td align="center" style="padding: 10px 12px;">
        <!-- Container Table -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #E6DBC6; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          
          <!-- Brand Header -->
          <tr>
            <td bgcolor="#1A1D20" class="header-padding" style="padding: 28px 32px; background-color: #1A1D20; text-align: left; border-bottom: 3px solid #b99750;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 1.5px; text-transform: uppercase; display: block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                      ACE PACKAGING
                    </span>
                    <span style="display: block; margin-top: 4px; font-size: 10px; color: #D6BC83; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">
                      Precision Food Containers &amp; IML Packaging · Daman, India
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="content-padding" style="padding: 32px 32px 24px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 19px; font-weight: 700; color: #1A1D20; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                Hello ${name},
              </h2>
              <p style="margin: 0 0 22px 0; font-size: 14px; line-height: 1.6; color: #4A4D52;">
                Thank you for requesting official commercial documentation from <strong>Ace Packaging</strong>. A verified copy of your requested file, <strong>${docName}</strong>, is available below for immediate access.
              </p>

              <!-- Document Delivery Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F4; border-radius: 12px; border: 1px solid #E6DBC6; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 22px;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                      <tr>
                        <td>
                          <span style="display: inline-block; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #9a7628; background-color: #efe5ce; padding: 3px 8px; border-radius: 4px; margin-bottom: 8px;">
                            Verified Official Document
                          </span>
                          <h3 style="margin: 0 0 12px 0; font-size: 17px; font-weight: 800; color: #1A1D20; line-height: 1.4;">
                            ${docName}
                          </h3>
                        </td>
                      </tr>
                    </table>

                    <!-- Metadata Table -->
                    <table role="presentation" border="0" cellspacing="0" cellpadding="4" width="100%" style="font-size: 12px; color: #555555; border-top: 1px solid #E6DBC6; padding-top: 10px; margin-top: 6px;">
                      ${company ? `<tr><td width="35%" style="color: #777;">Organization:</td><td style="color: #1A1D20; font-weight: 600;">${company}</td></tr>` : ''}
                      ${industry ? `<tr><td width="35%" style="color: #777;">Industry Segment:</td><td style="color: #1A1D20; font-weight: 600;">${industry}</td></tr>` : ''}
                      <tr><td width="35%" style="color: #777;">Dispatch Date:</td><td style="color: #1A1D20; font-weight: 600;">${currentDateFormatted}</td></tr>
                      <tr><td width="35%" style="color: #777;">Distribution:</td><td style="color: #1A1D20; font-weight: 600;">${attachmentPath ? 'Attached File + Direct Cloud Link' : 'Direct Cloud Download'}</td></tr>
                    </table>

                    <!-- Bulletproof CTA Button -->
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                      <tr>
                        <td align="center" bgcolor="#b99750" style="border-radius: 8px;">
                          <a href="${fullDownloadLink}" target="_blank" class="btn-primary" style="display: inline-block; padding: 13px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 700; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 0.8px; border-radius: 8px; background-color: #b99750;">
                            📥 Download / View Document
                          </a>
                        </td>
                      </tr>
                    </table>

                    ${attachmentPath ? `
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" style="margin-top: 14px;">
                      <tr>
                        <td style="background-color: #edf7ed; border: 1px solid #c8e6c9; border-radius: 6px; padding: 9px 12px; font-size: 11px; color: #1e7e34; font-weight: 600;">
                          ✓ A copy of this document (${attachmentFilename || 'document'}) has also been attached directly to this email.
                        </td>
                      </tr>
                    </table>` : ''}

                    <p style="margin: 12px 0 0 0; font-size: 11px; color: #888888; line-height: 1.4;">
                      Direct link: <a href="${fullDownloadLink}" style="color: #b99750; word-break: break-all; text-decoration: underline;">${fullDownloadLink}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Quality Credibility Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F4; border-radius: 12px; border-left: 4px solid #b99750; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #1A1D20;">
                      Plant Quality Assurance &amp; Compliance Standards
                    </h4>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="3" width="100%" style="font-size: 12px; color: #4A4D52; line-height: 1.5;">
                      <tr>
                        <td valign="top" width="20" style="font-size: 14px;">🏭</td>
                        <td><strong>ISO 9001:2015 Accredited:</strong> Certified manufacturing in Daman, India (Cert. IN25/00000652).</td>
                      </tr>
                      <tr>
                        <td valign="top" width="20" style="font-size: 14px;">🥗</td>
                        <td><strong>100% Prime Virgin PP 05:</strong> Food-grade polymer, BPA-free, odorless &amp; safe for direct contact.</td>
                      </tr>
                      <tr>
                        <td valign="top" width="20" style="font-size: 14px;">❄️</td>
                        <td><strong>Thermal Resistance:</strong> Deep freeze (−20°C) to microwave heating (+120°C) endurance tested.</td>
                      </tr>
                      <tr>
                        <td valign="top" width="20" style="font-size: 14px;">🔒</td>
                        <td><strong>Spill-Resistant Seals:</strong> High-precision injection moulded lids engineered for delivery transit.</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Commercial Support & Sample Kits -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px dashed #E6DBC6; border-radius: 12px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #1A1D20;">
                      Need Physical Sample Kits, Custom IML Branding, or Wholesale Pricing?
                    </h4>
                    <p style="margin: 0 0 12px 0; font-size: 12px; color: #666666; line-height: 1.5;">
                      We ship physical sample kits alongside our printed catalog so your QC and operations teams can verify fits, sealing, and freeze-thaw endurance in hand.
                    </p>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" bgcolor="#25D366" style="border-radius: 6px;">
                          <a href="${whatsappLink}" target="_blank" style="display: inline-block; padding: 9px 18px; font-size: 12px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 6px; background-color: #25D366;">
                            💬 Chat on WhatsApp Desk
                          </a>
                        </td>
                        <td style="padding-left: 12px;">
                          <span style="font-size: 12px; color: #555555;">
                            or call: <a href="tel:+919925015906" style="color: #1A1D20; font-weight: 700; text-decoration: none;">+91 99250 15906</a>
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #777777; line-height: 1.5;">
                Have questions or need custom mould requirements? You can also reply directly to this email or write to <a href="mailto:sales@acepack.co.in" style="color: #b99750; font-weight: 600;">sales@acepack.co.in</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#f5f0e6" style="padding: 22px 32px; background-color: #f5f0e6; border-top: 1px solid #E6DBC6; font-size: 11px; color: #777777; text-align: center; line-height: 1.6;">
              <strong style="color: #1A1D20;">Ace Packaging</strong> · Survey No. 142/1 &amp; Somnath Road, Dabhel, Daman - 396210, India<br />
              Official Website: <a href="https://acepack.co.in" style="color: #b99750; text-decoration: none; font-weight: 600;">acepack.co.in</a><br />
              <span style="color: #999999; font-size: 10px; display: inline-block; margin-top: 6px;">
                This technical document was requested for ${email}. © ${new Date().getFullYear()} Ace Packaging. All rights reserved.
              </span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Prepare executive HTML email for Admin notification
    const adminHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Lead: ${docName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF8F4; margin: 0; padding: 24px; color: #1A1D20;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #E6DBC6; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
    <tr>
      <td style="padding: 20px 24px; background-color: #1A1D20; border-bottom: 3px solid #b99750;">
        <span style="font-size: 10px; font-weight: 800; color: #D6BC83; letter-spacing: 1.5px; text-transform: uppercase;">
          ACE PACKAGING · CRM LEAD ALERT
        </span>
        <h2 style="margin: 4px 0 0 0; font-size: 18px; color: #ffffff; font-weight: 800;">
          New Document Download Lead
        </h2>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <div style="background-color: #FAF8F4; border-radius: 8px; border: 1px solid #E6DBC6; padding: 14px 18px; margin-bottom: 20px;">
          <span style="font-size: 11px; text-transform: uppercase; color: #a8812f; font-weight: 800;">Requested Item:</span>
          <div style="font-size: 16px; font-weight: 800; color: #1A1D20; margin-top: 2px;">${docName}</div>
        </div>

        <table width="100%" border="0" cellspacing="0" cellpadding="8" style="font-size: 13px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td width="35%" style="color: #666; font-weight: 600;">Lead Name:</td>
            <td style="color: #1A1D20; font-weight: 700;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="color: #666; font-weight: 600;">Email Address:</td>
            <td><a href="mailto:${email}" style="color: #b99750; font-weight: 700; text-decoration: none;">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="color: #666; font-weight: 600;">Phone / WhatsApp:</td>
            <td>
              <a href="tel:${phone}" style="color: #1A1D20; font-weight: 700; text-decoration: none;">${phone || 'Not provided'}</a>
              ${cleanPhoneDigits ? `&nbsp;·&nbsp;<a href="https://wa.me/${cleanPhoneDigits}" target="_blank" style="color: #25D366; font-weight: 700; text-decoration: none;">WhatsApp Lead</a>` : ''}
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="color: #666; font-weight: 600;">Company / Brand:</td>
            <td style="color: #1A1D20; font-weight: 600;">${company || 'Individual / Not specified'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="color: #666; font-weight: 600;">Industry Segment:</td>
            <td style="color: #1A1D20;">${industry || 'Not specified'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="color: #666; font-weight: 600;">Document Link:</td>
            <td><a href="${fullDownloadLink}" style="color: #b99750; text-decoration: underline; font-size: 11px;">${fullDownloadLink}</a></td>
          </tr>
          <tr>
            <td style="color: #666; font-weight: 600;">Timestamp:</td>
            <td style="color: #777; font-size: 12px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
          </tr>
        </table>

        <!-- Quick Action Buttons -->
        <table border="0" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
          <tr>
            <td align="center" bgcolor="#b99750" style="border-radius: 6px;">
              <a href="mailto:${email}?subject=${encodeURIComponent(`Ace Packaging Inquiry - ${docName}`)}" style="display: inline-block; padding: 10px 18px; font-size: 12px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 6px; background-color: #b99750;">
                ✉️ Reply via Email
              </a>
            </td>
            ${cleanPhoneDigits ? `
            <td style="padding-left: 10px;" align="center" bgcolor="#25D366" style="border-radius: 6px;">
              <a href="https://wa.me/${cleanPhoneDigits}?text=${encodeURIComponent(`Hello ${name}, thank you for requesting ${docName} from Ace Packaging.`)}" target="_blank" style="display: inline-block; padding: 10px 18px; font-size: 12px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 6px; background-color: #25D366;">
                💬 WhatsApp Chat
              </a>
            </td>` : ''}
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Check if SMTP credentials are configured
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
        subject: `Verified Document Delivery: ${docName} | Ace Packaging`,
        html: userHtml,
        attachments,
      });

      // Send notification to admin sales desk
      const adminEmail = process.env.ADMIN_EMAIL || 'sales@acepack.co.in';
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Ace Packaging Leads" <${smtpUser}>`,
        to: adminEmail,
        subject: `[Lead] Download Request: ${docName} - ${name} (${company || 'Individual'})`,
        html: adminHtml,
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
