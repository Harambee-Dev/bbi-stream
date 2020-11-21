import natural from 'natural';
import Sentiment from 'sentiment';
import data from '../data/tweets'
import { Data } from './types';
const sentiment = new Sentiment();
const classifier = new natural.BayesClassifier();
classifier.addDocument(['president','secretary', 'minister', 'ombudsman', 'senate', 'nominate', 'parliament', 'county', 'position', 'judiciary' ], 'positions');
classifier.addDocument(['uhuru', 'uhunye', 'kenyatta', 'jomo', 'jayden', 'kibaki', 'ruto', 'raila', 'baba', 'odinga', 'kalonzo', 'mudavadi', 'kivutha', 'karua', 'atwoli', 'political', 'politician', 'leader'], 'politician');
classifier.addDocument(['vote', 'corruption', 'power', 'governance', 'unity', 'accountability', 'freedom', 'inclusivity', 'patriotism', 'nationalism', 'land', 'civic', 'courage', 'truth', 'honesty', 'discrimination', 'impunity', 'dialogue', 'democracy'  ], 'ethos');
classifier.addDocument(['people', 'kenyan', 'youth', 'vijana', 'women', 'elder', 'elite', 'wanjiku', 'mwananchi', 'person with', 'rich', 'poor', 'hustler', 'dynasty'], 'people');
classifier.addDocument(['resource', 'national', 'tax', 'taxes', 'economy', 'helb', 'tax break', 'unemployment', 'employment', 'job', 'revenue', 'employ', 'kazi', 'wealth', 'loan', 'wheelbarrow'], 'economy');
classifier.train();

function test(){
    let overallSentimentScore = 0
    const tweets = (data as Data).statuses
    for (const tweet of tweets) {
        const sentiment = getSentiment(tweet.text)
        overallSentimentScore += sentiment.sentimentAnalysis.score
        console.log(`${tweet.text.trim().replace('\n', '')}
\t sentiment: ${sentiment.sentimentAnalysis.score}
\t classification: ${sentiment.classification.map(cls => `${cls.label}`).join(', ')}
\n`);
    }
    console.log(`Overall Score: ${overallSentimentScore} from ${tweets.length} tweets`);
}

function getSentiment(text: string) {
    const sentimentAnalysis = sentiment.analyze(text);
    const classification = classifier.getClassifications(text)
    return { sentimentAnalysis, classification}
}
test()