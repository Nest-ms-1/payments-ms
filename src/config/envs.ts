import 'dotenv/config'
import * as Joi from 'joi'

interface EnvVars {
  PORT: number
  STRIPE_SECRET: string
  STRIPE_SUCCESS_URL: string
  STRIPE_CANCEL_URL: string
  STRIPE_ENDPOINT_SECRET: string
}

const envsSchema = Joi.object({
  PORT: Joi.number().required(),
  STRIPE_SECRET: Joi.string().required(),
  STRIPE_SUCCESS_URL: Joi.string().required(),
  STRIPE_CANCEL_URL: Joi.string().required(),
  STRIPE_ENDPOINT_SECRET: Joi.string().required(),
}).unknown(true)

const { error, value } = envsSchema.validate(process.env)

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
}
