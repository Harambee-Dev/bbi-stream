const natural = require('natural');
const Sentiment = require('sentiment');
const config = require('dotenv').config()

const Twit = require('twit')

const sentiment = new Sentiment();
const classifier = new natural.BayesClassifier();
classifier.addDocument(['president','secretary', 'minister', 'ombudsman', 'senate', 'nominate', 'parliament', 'county', 'position', 'judiciary' ], 'positions');
classifier.addDocument(['uhuru', 'uhunye', 'kenyatta', 'jomo', 'jayden', 'kibaki', 'ruto', 'raila', 'baba', 'odinga', 'kalonzo', 'mudavadi', 'kivutha', 'karua', 'atwoli', 'political', 'politician', 'leader'], 'politician');
classifier.addDocument(['vote', 'corruption', 'power', 'governance', 'unity', 'accountability', 'freedom', 'inclusivity', 'patriotism', 'nationalism', 'land', 'civic', 'courage', 'truth', 'honesty', 'discrimination', 'impunity', 'dialogue', 'democracy'  ], 'ethos');
classifier.addDocument(['people', 'kenyan', 'youth', 'vijana', 'women', 'elder', 'elite', 'wanjiku', 'mwananchi', 'person with', 'rich', 'poor', 'hustler', 'dynasty'], 'people');
classifier.addDocument(['resource', 'national', 'tax', 'taxes', 'economy', 'helb', 'tax break', 'unemployment', 'employment', 'job', 'revenue', 'employ', 'kazi', 'wealth', 'loan', 'wheelbarrow'], 'economy');
classifier.train();

const T = new Twit({
    consumer_key : process.env.TWITTER_API_KEY,
    consumer_secret : process.env.TWITTER_API_SECRET,
    access_token : process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret : process.env.TWITTER_TOKEN_SECRET,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

const stream = T.stream('statuses/filter', { track: ['#BBIReport', '#BBI', '#RejectBBI', '#BBINonsense'] })

stream.on('limit', function (limitMessage) {
    console.log(limitMessage)
})

stream.on('disconnect', function (disconnectMessage) {
    console.log(disconnectMessage)
})

stream.on('tweet', function (tweet) {
    //remove all username
    let text = tweet.text.replace(/@([A-Za-z0-9_]+)/g,"");

    //remove all hashtags
    text = text.replace(/#([A-Za-z0-9_]+)/g,"");

    //remove all URLs
    text = text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g,"");

    //make all lowercase
    text = text.toLowerCase().trim();
    const sentimentAnalysis = sentiment.analyze(text);
    console.log('Tweet: ', text)
    console.log({
        id: tweet.id,
        source: tweet.user.id,
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
        classifier: classifier.getClassifications(text)
    })
})

