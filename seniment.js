var request = require('request');
var async = require('async');
var fs = require('fs');
var pg = require('pg');
var sentiment = require('sentiment');

var conString = "postgres://bbc:phatbeats@localhost:5432/bbcpapers";

pg.connect(conString, function(err, client, done) {
	if(err) throw err;

	var query = client.query('select * from articles');
	query.on('row', function(row) {

		var text = row.article_text.split(';;').join(' ');
		var sent = sentiment(text);

		var sentimentComparitive = sent.comparative;
		var negativeWords = sent.negative.join(';;');
		var positiveWords = sent.positive.join(';;');
		var updateString = 'UPDATE articles SET sentiment=$1, negative_words=$2, positive_words=$3 WHERE id=$4';

		// console.log('Comparitive: ', sentimentComparitive);
		// console.log('Positive: ', negativeWords);
		// console.log('Negative: ', positiveWords);

		client.query(updateString, [sentimentComparitive, negativeWords, positiveWords, row.id], function(err, result) {
			if(err) throw err;
			// console.log('Updated ', row.id, ':: isCandidate: ', isCandidate, 'isFormal: ', isFormal );
		});
    });
    // query.on('end', client.end.bind(client));
});

// { score: 33,
//   comparative: 0.02894736842105263,
//   tokens: [],
//   positive: [],
//   negative: []
// }