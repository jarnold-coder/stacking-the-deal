// Wraps src/app.html (the artifact body: <title>, <style>, markup, <script>) into a standalone index.html.
// Usage: node build.js
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'src', 'app.html'), 'utf8');
const title = (src.match(/<title>([^<]*)<\/title>/) || [, 'Stacking the Deal'])[1];
const body = src.replace(/<title>[^<]*<\/title>\s*/, '');
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#F1F2EC" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0F1512" media="(prefers-color-scheme: dark)">
<meta name="description" content="A mobile primer and live proforma for architects: learn NOI, DSCR and leveraged return, then stack green design moves and tax credits until the bank says yes.">
<title>${title}</title>
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏗️</text></svg>')}">
<style>html,body{margin:0;height:100%}</style>
</head>
<body>
${body}
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('index.html written,', html.length.toLocaleString(), 'bytes');
