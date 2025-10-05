Project: hyenngoanxinhiu
Files included:
- create.html  => page to create card (upload image, enter name & message)
- index.html   => view card by ?id=
- api/cards.js => simple serverless API to POST/GET cards (stores in db.json)
- db.json      => initial empty database
- vercel.json  => vercel config

Deploy steps:
1. Go to https://vercel.com and log into your account.
2. Create a new project and import this folder (or drag & drop the zip).
3. Deploy. After deploy, open /create.html to create a card.
Note:
- This demo stores images as base64 inside db.json. It's OK for small usage & demo only.
- Vercel serverless functions have ephemeral filesystem; db.json will persist across invocations for the running instance, but may reset on redeploy. For production use, use external DB or storage.