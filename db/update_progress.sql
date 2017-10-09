UPDATE goals
SET progress = progress + $2
WHERE goal = $1; 