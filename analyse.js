var async = require('async');
var fs = require('fs');
var pg = require('pg');

var conString = "postgres://bbc:phatbeats@localhost:5432/bbcpapers";

pg.connect(conString, function(err, client, done) {
	if(err) throw err;

	var query = client.query('select * from articles');
	query.on('row', function(row) {
		analyseArticle(row, function(isCandidate, isFormal) {
			// console.log('----------------------------------------------------------------------');
			// console.log('----------------------------------------------------------------------');
			// console.log('----------------------------------------------------------------------');
			// console.log('isCandidate: ', isCandidate, 'isFormal: ', isFormal);
			// console.log('----------------------------------------------------------------------');
			// console.log(row.article_text);
			//is_candidate boolean, has_formal_usage boolean
			client.query('UPDATE articles SET is_candidate=$1, has_formal_usage=$2 WHERE id=$3', [isCandidate, isFormal, row.id], function(err, result) {
				if(err) throw err;
				// console.log('Updated ', row.id, ':: isCandidate: ', isCandidate, 'isFormal: ', isFormal );
			});
		});
    });
    // query.on('end', client.end.bind(client));
});

function analyseArticle(row, callback) {
	var isCandidate = false;
	var isFormal = false;;

	var fragments = row.article_text.toLowerCase().split(';;');

	for (var f = 0; f <= fragments.length-1; f++) {
		if(fragments[f].indexOf('hitler') !== -1) {
			var tmp = fragments[f].split('hitler');
			
			if (tmp[0].length > 0){
				isCandidate = true;
				if(tmp[0].indexOf('herr') !== -1 || tmp[0].indexOf('hcrr') !== -1 || tmp[0].indexOf('heir') !== -1) {
					isFormal = true;
				}
			}

			// console.log('----------------------------------------------------------------------');
			// console.log('----------------------------------------------------------------------');
			// console.log('----------------------------------------------------------------------');
			// console.log('-- ORIGINAL --')
			// console.log(fragments[f]);
			// console.log('-- SPLIT --')
			// console.log(fragments[f].split('hitler'));

			// var tmp = fragments[f].split('hitler');
			
			// if (tmp[0].length > 0){
			// 	console.log('-- HAS PRECEDING WORD --');
			// 	isCandidate = true;

			// 	if(tmp[0].indexOf('herr') !== -1 || tmp[0].indexOf('hcrr') !== -1) {
			// 		console.log('-- IS FORMAL --')
			// 		isFormal = true;
			// 	} else {
			// 		console.log('-- IS NOT FORMAL --')
			// 		isFormal = false;
			// 	}
			// } else {
			// 	console.log('-- >NO< PRECEDING WORD --')
			// 	isCandidate = false;
			// }
		}
		if (f === fragments.length-1) {
			callback(isCandidate, isFormal);
		}
	}
}