CREATE TABLE blogs (
	id SERIAL PRIMARY KEY,
  	author text, 
  	url text NOT NULL, 
  	title text NOT NULL, 
  	likes integer DEFAULT 0 
);

insert into blogs (author, url, title) values ('Mattiesko', 'www.netti.net', 'Kouluihin shampanjatunti');
insert into blogs (url, title) values ('www.ploki.fi', 'Ei jumalauta');

