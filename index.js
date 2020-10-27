
const config = require('dotenv').config()
const stream = require('./src/tweets')
const categoryClassifier = require('./src/clasifier')
const connectToDatabase = require('./db/connection')

const cleanText = (tweet) => {
    //remove all username
    let text = tweet.replace(/@([A-Za-z0-9_]+)/g,"");
    //remove all hashtags
    text = text.replace(/#([A-Za-z0-9_]+)/g,"");
    //remove all URLs
    text = text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g,"");
    //make all lowercase
    text = text.toLowerCase().trim();

    return text
}

const tweetHandler = async function (tweet) {
    const text = cleanText(tweet.text)
    const { sentimentAnalysis, classification } = categoryClassifier(text)
    console.log('Tweet: ', text)
    const db = await connectToDatabase(process.env.MONGODB_URI)
    const tweets = await db.collection('tweets')
    await tweets.insertMany([{
        id: tweet.id,
        source: tweet.user.id,
        text,
        user: {
            name: tweet.user.name,
            display: tweet.user.screen_name,
            verified: tweet.user.verified,
            image: tweet.user.profile_image_url_https
        },
        entities: tweet.entities,
        impact: 0,
        sentiment: {
            score: sentimentAnalysis.score,
            positive: sentimentAnalysis.positive,
            negative: sentimentAnalysis.negative,
        },
        classification
    }])
}

stream(tweetHandler)




