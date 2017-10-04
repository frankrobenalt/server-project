INSERT INTO goals(goal, timesperweek, wager, id) VALUES ($1, $2, $3, $4);
SELECT * FROM goals WHERE id = $4;