-- Connect to the 'connections' database
\c our_civic_voice;

-- Create the 'automations' role
CREATE ROLE admin;
CREATE ROLE automations;
CREATE ROLE express;

-- Setup privileges on the 'Ontario' tables
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ontario_reps TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ontario_offices TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ontario_reps TO automations;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ontario_offices TO automations;
GRANT SELECT ON TABLE ontario_reps TO express;
GRANT SELECT ON TABLE ontario_offices TO express;
GRANT USAGE ON SEQUENCE ontario_offices_office_id_seq TO admin, automations;

-- Setup privileges on the 'Federal' tables
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE federal_reps TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE federal_offices TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE federal_reps TO automations;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE federal_offices TO automations;
GRANT SELECT ON TABLE federal_reps TO express;
GRANT SELECT ON TABLE federal_offices TO express;
GRANT USAGE ON SEQUENCE federal_offices_office_id_seq TO admin, automations;

-- Setup privileges on the 'All Representatives' Materialized View
GRANT USAGE ON SCHEMA public TO automations, express;
ALTER MATERIALIZED VIEW all_representatives OWNER TO automations;

GRANT SELECT ON all_representatives TO express;
