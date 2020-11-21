import Twit from "twit";
import { Data } from "./types";
require("dotenv").config();
import { PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();


const T = new Twit({
  consumer_key: process.env.TWITTER_API_KEY as string,
  consumer_secret: process.env.TWITTER_API_SECRET as string,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});
const from = (year: string, month: string, day: string) =>
`${year}-${month}-${day}`;

async function search() {
  try {
    const result = await T.get("search/tweets", {
      q: `#BBIReport OR #BBI OR #RejectBBI OR #BBINonsense`,
    });
    const data = result && (result.data as Data);
    data.statuses.forEach((tweet) => {
      console.log(tweet.text);
    });
  } catch (error) {
    console.log(error);
  }
}
search();
