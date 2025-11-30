// api/join.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // 1. Tillåt endast POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Hämta data (Vercel parsar oftast automatiskt, så vi kör direkt på req.body)
    const body = req.body;
    const { name, email, country, family } = typeof body === 'string' ? JSON.parse(body) : body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // 3. Skicka notis till DIG
    await resend.emails.send({
      from: 'Fami Waitlist <onboarding@resend.dev>',
      to: 'joinfami@gmail.com', 
      subject: `Ny person på väntelistan: ${name}`,
      html: `
        <h3>Ny Founding Family-ansökan! 🚀</h3>
        <p><strong>Namn:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Land:</strong> ${country}</p>
        <p><strong>Berättelse:</strong> ${family}</p>
      `
    });

    // 4. Skicka välkomstmejl till ANVÄNDAREN
    // OBS: Tills du verifierat en egen domän i Resend, måste 'from' vara onboarding@resend.dev
    // och du kan bara skicka till din egen mail. 
    // När du är live på riktigt, ändra 'to' till 'email' variabeln.
    
    /* 
    await resend.emails.send({
      from: 'Fami <onboarding@resend.dev>', 
      to: email, // Detta funkar bara om du verifierat domän eller om 'email' är din egen under test
      subject: 'Välkommen till Fami – Founding Families',
      html: `<p>Hej ${name}, tack för att du gick med...</p>` 
    });
    */

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}