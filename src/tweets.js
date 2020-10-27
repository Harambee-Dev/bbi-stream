const Twit = require('twit')
const T = new Twit({
    consumer_key : process.env.TWITTER_API_KEY,
    consumer_secret : process.env.TWITTER_API_SECRET,
    access_token : process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret : process.env.TWITTER_TOKEN_SECRET,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            true,     // optional - requires SSL certificates to be valid.
})
module.exports = function listen(cb) {
    const stream = T.stream('statuses/filter', { track: ['#BBIReport', '#BBI', '#RejectBBI', '#BBINonsense'] })
    stream.on('limit', function (limitMessage) {
        console.log(limitMessage)
    })
    stream.on('disconnect', function (disconnectMessage) {
        console.log(disconnectMessage)
    })
    stream.on('tweet', function (tweet) {
        cb(tweet)
    })
}