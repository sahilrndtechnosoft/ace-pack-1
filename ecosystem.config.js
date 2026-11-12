// PM2 process file for the production website.
//
//   npm ci && npm run build:prod      # build into .next-prod (separate from the dev server's .next)
//   pm2 start ecosystem.config.js     # serve on http://localhost:4787
//   pm2 save && pm2 startup           # keep it running after a reboot
//
// Secrets (MySQL, JWT_SECRET, SMTP...) are read by Next.js from .env at startup; keep them out of this file.

const PORT = 4787; // chosen because nothing else on this server uses it (3000 = dev server)

module.exports = {
  apps: [
    {
      name: 'acepack-website',
      cwd: __dirname,
      script: 'node_modules/next/dist/bin/next',
      args: `start -p ${PORT}`,
      exec_mode: 'fork', // one process: the MySQL pool and page cache live in memory
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '20s',
      max_memory_restart: '1G',
      kill_timeout: 10000,
      time: true,
      out_file: './logs/pm2-out.log',
      error_file: './logs/pm2-error.log',
      env: {
        NODE_ENV: 'production',
        PORT,
        ACEPACK_BUILD_DIR: '.next-prod', // must match `npm run build:prod`
      },
    },
  ],
};
