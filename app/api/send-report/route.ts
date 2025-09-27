import { NextResponse } from "next/server";
import { resend } from "@/lib/resendClient";
import { generateEnergyReport } from "@/lib/pdfGenerator";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Generate PDF bytes as ArrayBuffer
    const pdfBytes = generateEnergyReport(body, { mode: "buffer" });

    if (!pdfBytes) {
      throw new Error("PDF generation failed, got null");
    }

    // Convert ArrayBuffer -> Buffer -> base64 string
    const buffer = Buffer.from(pdfBytes);
    const base64Pdf = buffer.toString("base64");

    // Send email with attachment
    const data = await resend.emails.send({
      from: "Reports <onboarding@resend.dev>", // replace with your verified domain
      to: body.email,
      subject: `${body.title} - Energy Report`,
      html: `<p>Hello,</p><p>Your requested energy report is attached.</p>`,
      attachments: [
        {
          filename: `${body.title}.pdf`,
          content: base64Pdf,
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
