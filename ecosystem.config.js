module.exports = {
  apps : [
      {
        name: "megatron-webhook",
        script: "./index.js",
        watch: true,
        interpreter: "./node_modules/.bin/babel-node",
        env: {
            "NODE_ENV": "dev"
        },
        env_production: {
            "NODE_ENV": "prod",
        }
      }
  ]
}