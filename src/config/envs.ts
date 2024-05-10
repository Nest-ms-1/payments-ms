import 'dotenv/config'
import * as Joi from 'joi'

interface EnvVars {
  PORT: number
  STRIPE_SECRET: string
  STRIPE_SUCCESS_URL: string
  STRIPE_CANCEL_URL: string
  STRIPE_ENDPOINT_SECRET: string
  NATS_SERVERS: string[]
}

const envsSchema = Joi.object({
  PORT: Joi.number().required(),
  STRIPE_SECRET: Joi.string().required(),
  STRIPE_SUCCESS_URL: Joi.string().required(),
  STRIPE_CANCEL_URL: Joi.string().required(),
  STRIPE_ENDPOINT_SECRET: Joi.string().required(),
  NATS_SERVERS: Joi.array().items(Joi.string()).required(),
}).unknown(true)

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
})
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}
const envsVars: EnvVars = value
export const envs = {
  port: envsVars.PORT,
  stripeSecret: envsVars.STRIPE_SECRET,
  stripeSuccessUrl: envsVars.STRIPE_SUCCESS_URL,
  stripeCancelUrl: envsVars.STRIPE_CANCEL_URL,
  stripeEndpointSecret: envsVars.STRIPE_ENDPOINT_SECRET,
  natsServers: envsVars.NATS_SERVERS,
}
