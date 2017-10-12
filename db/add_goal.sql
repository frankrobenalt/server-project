INSERT INTO exercise_goals(goal, timesperweek, wager, id, category, date_created, end_date, wager_option, total_savings) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
SELECT * FROM goals WHERE id = $4;