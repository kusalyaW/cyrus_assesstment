import app from './app.js';
import { config } from './config.js';
import { runMigrations } from './migrations.js';

// Run DB migrations first, then start server
runMigrations()
  .then(() => {
    const server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

    server.on('error', (error) => {
      console.error('Server error:', error);
    });
  })
  .catch((err) => {
    console.error('Failed to run migrations:', err);
    process.exit(1);
  });

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
