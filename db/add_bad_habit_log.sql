INSERT INTO habit_goal_logs (goalid, log_date, log_value, first_day) VALUES ($1, $2, $3, $4);
UPDATE quit_habit SET logged_today = true, 
log_value = $3;