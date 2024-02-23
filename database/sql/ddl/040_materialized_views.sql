-- Connect to the 'connections' database
\c our_civic_voice;

CREATE MATERIALIZED VIEW all_representatives AS
  SELECT member_id,
    honorific,
    first_name,
    last_name,
    constituency,
    party,
    province_territory, 
    gov_level 
   FROM federal_reps
  UNION
    SELECT member_id,
    honorific,
    first_name,
    last_name,
    constituency,
    party,
    province_territory, 
    gov_level 
   FROM ontario_reps
;
