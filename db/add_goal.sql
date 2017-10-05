INSERT INTO goals(goal, timesperweek, wager, id, category) VALUES ($1, $2, $3, $4, $5);
SELECT * FROM goals WHERE id = $4;