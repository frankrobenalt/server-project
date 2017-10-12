SELECT *,EXTRACT(DOW FROM log_date) AS DOW,
CASE WHEN EXTRACT(DOW FROM log_date) = 0 THEN log_value END Sunday,
CASE WHEN EXTRACT(DOW FROM log_date) = 1 THEN log_value END Monday,
CASE WHEN EXTRACT(DOW FROM log_date) = 2 THEN log_value END Tuesday,
CASE WHEN EXTRACT(DOW FROM log_date) = 3 THEN log_value END Wednesday,
CASE WHEN EXTRACT(DOW FROM log_date) = 4 THEN log_value END Thursday,
CASE WHEN EXTRACT(DOW FROM log_date) = 5 THEN log_value END Friday,
CASE WHEN EXTRACT(DOW FROM log_date) = 6 THEN log_value END Saturday,
(date_trunc('week', log_date::timestamp)- '1 days'::interval)::date AS first_day
FROM goal_logs WHERE goalid = $1;