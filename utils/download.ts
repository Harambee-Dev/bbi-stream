import fetch from "node-fetch";

import { URLSearchParams } from "url";
import { getAuthHeader } from "./twitter";

// Rate limit of 450 requests per 15-minute window
// https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent#requests
async function download() {
  const params = new URLSearchParams({
    "query": ["#BBIReport OR #BBI OR #RejectBBI OR #BBINonsense"],
  });
  const requestOptions = {
    method: "GET",
    redirect: "follow" as "follow",
    url: `https://api.twitter.com/2/tweets/search/recent?${params}`,
  };
  const authHeader = getAuthHeader(requestOptions);
  console.log(requestOptions.url);
  const res = await fetch(requestOptions.url, {
    method: requestOptions.method,
    redirect: requestOptions.redirect,
    headers: authHeader as any,
  });
  const result = await res.text();
  console.log(result);
  // const prisma = new PrismaClient()
}

download();
