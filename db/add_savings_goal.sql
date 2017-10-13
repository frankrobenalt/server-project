INSERT INTO savings(installment_option, savings_goal, date_created, end_date, user_id, goal, installment_value, next_log) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
SELECT * FROM savings WHERE user_id = $5;