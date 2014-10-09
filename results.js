var async = require('async');
var fs = require('fs');
var pg = require('pg');

var conString = "postgres://bbc:phatbeats@localhost:5432/bbcpapers";

pg.connect(conString, function(err, client, done) {
	if(err) throw err;

	// console.log('TOTAL');
	// client.query('select count(*) from articles where is_candidate is True and has_formal_usage is False', function(err, result) {
	// 	if(err) throw err;
	// 	console.log('A', result.rows[0].count);
	// });
	// client.query('select count(*) from articles where is_candidate is True and has_formal_usage is True', function(err, result) {
	// 	if(err) throw err;
	// 	console.log('A', result.rows[0].count);
	// });

	// var totalBefore = false;
	// var totalAfter = false;
	// var herrBefore = false;
	// var herrAfter = false;

	// client.query('select count(*) from articles where is_candidate and pub_date <= \'1939-08-31\'', function(err, result) {
	// 	if(err) throw err;
	// 	totalBefore = result.rows[0].count;
	// 	calculate();
	// });
	// client.query('select count(*) from articles where is_candidate and pub_date >= \'1939-09-01\'', function(err, result) {
	// 	if(err) throw err;
	// 	totalAfter = result.rows[0].count;
	// 	calculate();
	// });

	// var baseQ = 'select count(*) from articles where is_candidate is True and has_formal_usage is True ';

	// //to_date('Nov-2006','Mon-YYYY')

	// client.query(baseQ+'and pub_date <= \'1939-08-31\'', function(err, result) {
	// 	if(err) throw err;
	// 	herrBefore = result.rows[0].count;
	// 	calculate();
	// });
	// client.query(baseQ+'and pub_date >= \'1939-09-01\'', function(err, result) {
	// 	if(err) throw err;
	// 	herrAfter = result.rows[0].count;
	// 	calculate();
	// });


	// function calculate() {
	// 	if(totalBefore && totalAfter && herrBefore && herrAfter) {
	// 		console.log('Total articles before August 31 1939: ', totalBefore);
	// 		console.log('Total articles after September 1 1939: ', totalAfter);
	// 		console.log('Articles that contain "Herr" before August 31 1939:  ', herrBefore, ' articles or ', herrBefore / totalBefore *100, '%');
	// 		console.log('Articles that contain "Herr" after September 1 1939: ', herrAfter, ' articles or ', herrAfter / totalAfter *100, '%');
	// 	}
	// }

	client.query('select to_char(pub_date,\'MM-YYYY\') as month, count(*) as total, count(nullif(has_formal_usage, false)) as has_formal_usage from articles where is_candidate is True group by month order by 1', function(err, result) {
		if(err) throw err;
		console.log(result);
	});

});




// Lower than august 31 1939
// Greater than september 1 1939
// January 1 1939 - august 31 1939 - how many times "hitler" vs "herr hitler"
// september 1 1939 - may 31 1940 - how many times "hitler" vs "herr hitler"