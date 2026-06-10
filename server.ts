// --- REPLACE ONLY THE BOTTOM 'startServer' PART IN YOUR SERVER.TS ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        // EADDRINUSE conflict pipeline layout bypass korbe
        hmr: { port: 24678 } 
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind listener only during stand-alone local server runs, strictly bypass during Vercel Serverless triggers
  if (!process.env.VERCEL) {
    const serverPort = process.env.PORT || PORT;
    const server = app.listen(serverPort, () => {
      console.log(`Server executing successfully on http://localhost:${serverPort}`);
    });

    // Node environment hot-reload crash controller listener
    process.on('SIGTERM', () => {
      server.close(() => {
        console.log('Process terminated gracefully.');
      });
    });
  }
}

startServer();
