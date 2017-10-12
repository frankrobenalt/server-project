DELETE FROM goal_logs WHERE goalid = $1;
DELETE FROM exercise_goals WHERE goalid = $1;
SELECT * FROM exercise_goals WHERE category = 'exercise';
