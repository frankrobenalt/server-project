SELECT gl.log_value, gl.log_date, gl.goal_log_id 
FROM habit_goal_logs gl
JOIN (SELECT log_date, MAX(goal_log_id) AS random FROM habit_goal_logs WHERE goalid=$1 GROUP BY log_date) AS sub ON gl.log_date = sub.log_date AND gl.goal_log_id = sub.random
WHERE goalid=$1 AND first_day <= $2 AND first_day >= $3;