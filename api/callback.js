// Étape 2 du handshake OAuth GitHub pour Decap CMS.
// Échange le "code" reçu de GitHub contre un access token,
// puis le transmet à la popup Decap CMS via postMessage.
export default async function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const { code } = req.query;

  if (!clientId || !clientSecret) {
    res.status(500).send("OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET manquants dans les variables d'environnement Vercel.");
    return;
  }
  if (!code) {
    res.status(400).send('Code OAuth manquant.');
    return;
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });
    const tokenData = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      res.status(400).send(`Erreur GitHub OAuth: ${tokenData.error_description || tokenData.error || 'token manquant'}`);
      return;
    }

    // Payload attendu par Decap CMS : {"token": "...", "provider": "github"}
    const payload = { token: tokenData.access_token, provider: 'github' };
    const payloadJson = JSON.stringify(payload);
    // JSON.stringify une seconde fois pour l'insérer en toute sécurité
    // comme littéral JS dans le <script> ci-dessous (échappe les guillemets).
    const payloadJsonLiteral = JSON.stringify(payloadJson);

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`<!doctype html>
<html><body>
<script>
(function() {
  function receiveMessage(e) {
    window.opener.postMessage(
      'authorization:github:success:' + ${payloadJsonLiteral},
      e.origin
    );
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body></html>`);
  } catch (err) {
    res.status(500).send('Erreur lors de l\'échange du token OAuth: ' + err.message);
  }
}
