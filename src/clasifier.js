const natural = require('natural');
const Sentiment = require('sentiment');

const sentiment = new Sentiment();
const classifier = new natural.BayesClassifier();
classifier.addDocument(['president','secretary', 'minister', 'ombudsman', 'senate', 'nominate', 'parliament', 'county', 'position', 'judiciary' ], 'positions');
classifier.addDocument(['uhuru', 'uhunye', 'kenyatta', 'jomo', 'jayden', 'kibaki', 'ruto', 'raila', 'baba', 'odinga', 'kalonzo', 'mudavadi', 'kivutha', 'karua', 'atwoli', 'political', 'politician', 'leader'], 'politician');
classifier.addDocument(['vote', 'corruption', 'power', 'governance', 'unity', 'accountability', 'freedom', 'inclusivity', 'patriotism', 'nationalism', 'land', 'civic', 'courage', 'truth', 'honesty', 'discrimination', 'impunity', 'dialogue', 'democracy'  ], 'ethos');
classifier.addDocument(['people', 'kenyan', 'youth', 'vijana', 'women', 'elder', 'elite', 'wanjiku', 'mwananchi', 'person with', 'rich', 'poor', 'hustler', 'dynasty'], 'people');
classifier.addDocument(['resource', 'national', 'tax', 'taxes', 'economy', 'helb', 'tax break', 'unemployment', 'employment', 'job', 'revenue', 'employ', 'kazi', 'wealth', 'loan', 'wheelbarrow'], 'economy');
classifier.train();


module.exports = function (text) {
    const sentimentAnalysis = sentiment.analyze(text);
    const classification = classifier.getClassifications(text)
    return { sentimentAnalysis, classification}
}