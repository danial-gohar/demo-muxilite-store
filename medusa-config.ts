import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000,https://docs.medusajs.com",
      adminCors: process.env.ADMIN_CORS || "http://localhost:5173,http://localhost:9000,https://docs.medusajs.com",
      authCors: process.env.AUTH_CORS || "http://localhost:5173,http://localhost:9000,https://docs.medusajs.com",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
  disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
  backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  modules: [
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
        redisOptions: {
        tls: {
          rejectUnauthorized: false
        },
        connectTimeout: 20000,
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
          retryStrategy(times) {
            if (times > 3) {
              return null;
            }
            return Math.min(times * 50, 2000);
          }
        } 
      },
    },
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
        redisOptions: {
        tls: {
          rejectUnauthorized: false
        },
        connectTimeout: 20000,
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
          retryStrategy(times) {
            if (times > 3) {
              return null;
            }
            return Math.min(times * 50, 2000);
          }
        }
      },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          url: process.env.REDIS_URL,
          tls: {
          rejectUnauthorized: false
          },
          connectTimeout: 20000,
          maxRetriesPerRequest: null, // CRITICAL: Must be null for BullMQ
          enableReadyCheck: false,
          retryStrategy(times) {
            if (times > 3) {
              return null;
            }
            return Math.min(times * 50, 2000);
          }
        },
      },
    },
  ],
})
