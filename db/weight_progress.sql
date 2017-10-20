UPDATE weight
SET progress = $2,
last_log = $3
WHERE goalid = $1;