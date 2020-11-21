//twitter.js
import crypto from 'crypto'
require('dotenv').config()

import OAuth, { RequestOptions } from 'oauth-1.0a';
const oauth = new OAuth({
  consumer: { key: process.env.TWITTER_API_KEY as string, secret: process.env.TWITTER_API_SECRET as string },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
      return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64')
  },
})
// Note: The token is optional for some requests
const token = {
  key: process.env.TWITTER_ACCESS_TOKEN as string,
  secret: process.env.TWITTER_TOKEN_SECRET as string
}
console.log(token);
export function getAuthHeader(request_data: RequestOptions){
  return oauth.toHeader(oauth.authorize(request_data, token))
}

