INSERT INTO exercise_goals(goal, timesperweek, wager, id, date_created, end_date, wager_option) VALUES ($1, $2, $3, $4, $5, $6, $7);
SELECT * FROM exercise_goals WHERE id = $4;