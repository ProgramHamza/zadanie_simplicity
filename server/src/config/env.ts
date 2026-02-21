import dotenv from 'dotenv'

dotenv.config()

const required = ['DATABASE_URL', 'CLIENT_URL', 'ADMIN_SECRET'] as const

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  CLIENT_URL: process.env.CLIENT_URL as string,
  ADMIN_SECRET: process.env.ADMIN_SECRET as string,
  PORT: Number(process.env.PORT ?? 4001),
}
