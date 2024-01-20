-- Create the 'automations' role
CREATE ROLE admin;

-- Connect to the 'connections' database
\c our_civic_voice;

-- Setup privileges on the Ontario tables
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ontario_mpps TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ontario_mpp_offices TO admin;
GRANT USAGE ON SEQUENCE ontario_mpp_offices_office_id_seq TO admin;

-- Setup privileges on the Federal tables
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE federal_mps TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE federal_mp_offices TO admin;
GRANT USAGE ON SEQUENCE federal_mp_offices_office_id_seq TO admin;
