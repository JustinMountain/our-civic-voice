-- Create the 'automations' role
CREATE ROLE admin;

-- Connect to the 'connections' database
\c connections;

-- Grant SELECT, INSERT, UPDATE, DELETE privileges on tableA to the 'automations' role
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ontario_mpps TO admin;

-- Grant SELECT, INSERT, UPDATE, DELETE privileges on tableB to the 'automations' role
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ontario_mpp_offices TO admin;

-- Grant the automation the ability to 
GRANT USAGE ON SEQUENCE ontario_mpp_offices_office_id_seq TO admin;
