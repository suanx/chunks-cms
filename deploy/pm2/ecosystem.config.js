module.exports = {
  apps: [
    {
      name: 'chunyu-server',
      cwd: './packages/server',
      script: 'dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      max_memory_restart: '500M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '../../logs/server-error.log',
      out_file: '../../logs/server-out.log',
    },
  ],
};
