import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  captcha_answer: string;
  honeypot: string;
  captcha_a: number;
  captcha_b: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body: ContactPayload = await req.json();
    const { name, email, message, captcha_answer, honeypot, captcha_a, captcha_b } = body;

    // Honeypot check — if filled, it's a bot
    if (honeypot) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Captcha validation — math check
    const expected = String(captcha_a + captcha_b);
    if (!captcha_answer || captcha_answer.trim() !== expected) {
      return new Response(
        JSON.stringify({ error: "Неверный ответ на контрольный вопрос" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return new Response(
        JSON.stringify({ error: "Заполните все поля" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get recipient email from settings
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: settings } = await supabase
      .from("site_settings")
      .select("contact_email")
      .eq("id", 1)
      .single();

    const recipientEmail = settings?.contact_email ?? "admin@norilskbook.ru";

    // Send email via Resend API
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "НорильскБук <onboarding@resend.dev>",
          to: [recipientEmail],
          reply_to: email.trim(),
          subject: `Новое сообщение от ${name.trim()}`,
          html: `
            <h2>Новое сообщение с сайта НорильскБук</h2>
            <p><strong>Имя:</strong> ${name.trim()}</p>
            <p><strong>Email:</strong> ${email.trim()}</p>
            <hr/>
            <p style="white-space: pre-wrap;">${message.trim()}</p>
            <hr/>
            <p style="color: #999; font-size: 12px;">
              Отправлено через форму обратной связи
            </p>
          `,
        }),
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        console.error("Resend error:", errText);
      }
    } else {
      console.warn("RESEND_API_KEY not set — skipping email send");
    }

    // Save to contact_messages table
    await supabase.from("contact_messages").insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Внутренняя ошибка сервера" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
