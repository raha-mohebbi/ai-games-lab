const requiredEnvVariables = ["DATABASE_URL", "REDIS_URL"];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}
const port = Number(process.env.PORT || 5000);

if(!Number.isInteger(port)|| port<=0 || port>65535){
    throw new Error("Port must be a valid port number")
}

export const env = {
  port,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
};