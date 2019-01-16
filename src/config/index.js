// @ts-check
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })

const config = {
  apiHost: process.env.API_HOST || '',
  apiVersion: process.env.API_VERSION || '',
  apiKey: process.env.API_KEY || '',
}

module.exports = {
  config
}
