UPDATE savings SET progress = progress + $2 WHERE id = $1;
SELECT * FROM savings WHERE id = $1;