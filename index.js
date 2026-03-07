const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>StudySprout</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
          h1 { color: #333; }
          p { color: #666; }
        </style>
      </head>
      <body>
        <h1>StudySprout</h1>
        <p>Learning platform is running</p>
      </body>
    </html>
  `);
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`StudySprout running on http://localhost:${PORT}`);
});
