This is a repo for some random scraping and parseing of some data for my partners thesis. Move along. Or whatever. :)


Some misc notes
===========

CREATE USER bbc WITH password 'phatbeats';
CREATE DATABASE bbcpapers WITH OWNER bbc;
CREATE TABLE articles(id text, url text, pub_date date, newspaper text, page_number integer, no_words integer, article_text text, type text, is_candidate boolean, has_formal_usage boolean, search_term text, sentiment numeric, negative_words text, positive_words text);


SELECT count(*), avg(sentiment), to_char(pub_date, 'YYYY-MM') as date
FROM articles
WHERE sentiment>=-0.04761904761
AND negative_words != '' OR positive_words != ''
group by date
order by date;

SELECT count(*), avg(sentiment), to_char(pub_date, 'YYYY-MM') as date
FROM articles
WHERE sentiment<=-0.04761904761
AND negative_words != '' OR positive_words != ''
group by date
order by date;

SELECT count(*), min(sentiment), max(sentiment), to_char(pub_date, 'YYYY-MM') as date
FROM articles
group by date
order by date;


max: 0.5714285714285714
min: -0.6666666666666666
mid: -0.04761904761


Methodology
===========

1. Scrape all articles between January 1 1939 and May 31 1940 that contain the word "hitler"
	- We collected: id, url, published date, newspaper name, page number, number of words, full OCR article text, article type
2. Add a column called "is_candidate". This column denotes weather the article meets the following criteria:
	- The word hitler has a word before it within the OCR'd string.
		-- This is because a lot of the OCR fragments contained strings starting with Hitler. We cannot be sure weather or not the word before it was "Herr" or something else.
		-- Eg. "Hitler's letter to M. Daladier was described" woiuld be discarded." - "MESSAGE TO HITLER" would be kept 
3. Add a column called "has_formal_usage" which denotes weather the article contains "Herr Hitler" (true) or "Hitler" (false)
	- Upon inspecting a number of the documents we found a lot of the records had 'Hcrr' instead of 'Herr' - this appears to be an OCR error and makes sense seeing as 'c' and 'e' look similar. With this in mind we counted them both as matches.
4. Calculate the total number of articles in each month that are candidates (is_candidates=True). Calculate the number of those candidates that also have a formal reference to Hitler (has_formal_usage=True)
5. Display number of "Herr Hitler" articles as a percentage of articles that mention "Hitler" for each month


#2:
Articles that include "nazi", "naziism", "hitlerism". Do sentiment analasys.