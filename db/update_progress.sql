UPDATE goals
SET progress = progress + $3,
logged_today = true,
log_value = $2,
last_log = $4
WHERE goalid = $1; 