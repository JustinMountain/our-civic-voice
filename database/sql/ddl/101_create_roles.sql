-- Connect to the 'connections' database
\c our_civic_voice;

-- Create the 'automations' role
CREATE ROLE admin;
CREATE ROLE automations;
CREATE ROLE express;

-- Setup privileges on the 'Ontario' tables
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ontario_mpps TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ontario_mpp_offices TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ontario_mpps TO automations;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ontario_mpp_offices TO automations;
GRANT SELECT ON TABLE ontario_mpps TO express;
GRANT SELECT ON TABLE ontario_mpp_offices TO express;
GRANT USAGE ON SEQUENCE ontario_mpp_offices_office_id_seq TO admin, automations;

-- Setup privileges on the 'Federal' tables
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE federal_mps TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE federal_mp_offices TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE federal_mps TO automations;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE federal_mp_offices TO automations;
GRANT SELECT ON TABLE federal_mps TO express;
GRANT SELECT ON TABLE federal_mp_offices TO express;
GRANT USAGE ON SEQUENCE federal_mp_offices_office_id_seq TO admin, automations;

-- Setup privileges on the 'All Representatives' Materialized View
GRANT USAGE ON SCHEMA public TO automations, express;
ALTER MATERIALIZED VIEW all_representatives OWNER TO automations;

GRANT SELECT ON all_representatives TO express;
