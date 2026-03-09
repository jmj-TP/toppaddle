import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, country, quoteFor, equipmentType, equipmentDetails, timestamp } = body;

        // Build the email content
        let equipmentHtml = '';

        if (quoteFor === 'complete' && equipmentType === 'custom') {
            equipmentHtml = `
        <h3>Custom Setup Details</h3>
        <p><strong>Blade:</strong> ${equipmentDetails.blade.Blade_Name} (${equipmentDetails.blade.Blade_Price} EUR)</p>
        <p><strong>Handle:</strong> ${equipmentDetails.handleType}</p>
        <p><strong>Forehand Rubber:</strong> ${equipmentDetails.forehandRubber.Rubber_Name} (${equipmentDetails.forehandRubber.Rubber_Price} EUR) - Thickness: ${equipmentDetails.forehandThickness}</p>
        <p><strong>Backhand Rubber:</strong> ${equipmentDetails.backhandRubber.Rubber_Name} (${equipmentDetails.backhandRubber.Rubber_Price} EUR) - Thickness: ${equipmentDetails.backhandThickness}</p>
        <p><strong>Total Estimated Price:</strong> ${equipmentDetails.totalPrice} EUR</p>
      `;
        } else if (quoteFor === 'complete' && equipmentType === 'pre') {
            equipmentHtml = `
        <h3>Pre-Assembled Racket Details</h3>
        <p><strong>Racket Model:</strong> ${equipmentDetails.Racket_Name}</p>
        <p><strong>Price:</strong> ${equipmentDetails.Racket_Price} EUR</p>
        <p><strong>Handle:</strong> ${equipmentDetails.handleType}</p>
      `;
        } else {
            // Fallback for individual items or single blades
            equipmentHtml = `
            <h3>Item Details</h3>
            <pre>${JSON.stringify(equipmentDetails, null, 2)}</pre>
        `;
        }

        const htmlContent = `
      <h2>New Quote Request via Table Tennis Hub</h2>
      <p><strong>Applicant Name:</strong> ${name}</p>
      <p><strong>Applicant Email:</strong> ${email}</p>
      <p><strong>Country:</strong> ${country || 'Not specified'}</p>
      <p><strong>Requested Quote For:</strong> ${quoteFor}</p>
      <p><strong>Submitted At:</strong> ${new Date(timestamp).toLocaleString()}</p>
      <hr />
      ${equipmentHtml}
    `;

        // Configure Nodemailer Transport using environment variables
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Send the email
        await transporter.sendMail({
            from: `"Table Tennis Hub" <${process.env.SMTP_USER}>`, // sender address
            to: process.env.CONTACT_EMAIL, // receiver (the site owner)
            replyTo: email, // Direct reply back to the applicant
            subject: `New Setup Quote Request from ${name}`,
            html: htmlContent,
        });

        return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        const err = error as any;
        const errorDetail = {
            message: err?.message,
            code: err?.code,
            command: err?.command,
            responseCode: err?.responseCode,
            response: err?.response,
        };
        console.error('SMTP Error Details:', JSON.stringify(errorDetail, null, 2));
        return NextResponse.json(
            { success: false, error: `Failed to send email: ${err?.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}
