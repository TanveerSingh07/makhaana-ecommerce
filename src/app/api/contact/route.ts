import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { name, email, phone, subject, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ For now: simulate email / CRM entry
    console.log("📩 New Contact Message:", {
      name,
      email,
      phone,
      subject,
      message,
    });

    // 🔮 Later:
    // - Send email to hello@makhaana.com
    // - Store in DB
    // - Push to admin panel inbox

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
