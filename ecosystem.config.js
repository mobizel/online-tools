module.exports = {
  apps: [
    {
      name: 'FRONT_MBZ_ONLINE_TOOLS',
      cwd: '/home/mobizel/online-dev-tools/current/',
      script: 'yarn',
      args: 'run start',
      interpreter: 'none',
      autorestart: true,
      instances: 1,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
