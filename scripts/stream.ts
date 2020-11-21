import Twit from "twit";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
require("dotenv").config();
const T = new Twit({
  consumer_key: process.env.TWITTER_API_KEY!,
  consumer_secret: process.env.TWITTER_API_SECRET!,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});
export function stream() {
  const stream = T.stream("statuses/filter", {
    track: ["#BBIReport", "#BBI", "#RejectBBI", "#BBINonsense"],
    lang: "en",
    locale: "en",
  });
  stream.on("limit", function (limitMessage) {
    console.log(limitMessage);
  });
  stream.on("disconnect", function (disconnectMessage) {
    console.log(disconnectMessage);
  });
  stream.on("tweet", function (tweet) {
    prisma.tweet.create({
      data: {
        user: {
          connect: { 
            id: tweet.user.id
          },
          create: {
            id: tweet.user.id,
            name: tweet.user.name,
            screen_name: tweet.user.screen_name,
            image: tweet.user.profile_image_url,
            verified: tweet.user.verified
          }
        },
        text: tweet.text,
        id: tweet.id,
      }
    })
    console.log(JSON.stringify(tweet));
  });
}
stream()
