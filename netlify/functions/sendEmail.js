const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { name, email, message } = JSON.parse(event.body);

  const sendGridApiKey = process.env.SENDGRID_API_KEY;
  const url = 'https://api.sendgrid.com/v3/mail/send';

  const emailData = {
    personalizations: [
      {
        to: [{ email: 'balovsky.balo@gmail.com' }], // adres, na który chcesz otrzymywać wiadomości
        subject: `Nowa wiadomość od ${name}`,
      },
    ],
    from: { email: 'formularz@example.com', name: 'Formularz Kontaktowy' },
    content: [
      {
        type: 'text/plain',
        value: `Nadawca: ${name}\nEmail: ${email}\nWiadomość: ${message}`,
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sendGridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Email wysłany pomyślnie!' }),
      };
    } else {
      const errorData = await response.json();
      console.error('Błąd wysyłania e-maila:', errorData);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Błąd wysyłania e-maila' }),
      };
    }
  } catch (error) {
    console.error('Błąd:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Wystąpił błąd podczas wysyłania e-maila' }),
    };
  }
};
