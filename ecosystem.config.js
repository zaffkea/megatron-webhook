module.exports = {
  apps : [
      {
        name: "megatron-webhook",
        script: "./index.js",
        watch: true,
        env: {
            "NODE_ENV": "dev"
        },
        env_production: {
            "NODE_ENV": "prod",
        }
      }
  ]
}