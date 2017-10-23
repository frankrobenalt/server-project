DELETE FROM goal_logs WHERE goalid = $1;
DELETE FROM exercise_goals WHERE goalid = $1;
DELETE FROM savings WHERE id = $1;
DELETE FROM weight WHERE goalid = $1;
DELETE FROM quit_habit WHERE goalid = $1;
SELECT * FROM exercise_goals;
