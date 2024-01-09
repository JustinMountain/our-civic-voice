-- Create the 'automations' role
CREATE ROLE admin;

-- Grant SELECT, INSERT, UPDATE, DELETE privileges on tableA to the 'automations' role
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE connections.ontario_mpp TO admin;

-- Grant SELECT, INSERT, UPDATE, DELETE privileges on tableB to the 'automations' role
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE connections.ontario_mpp_offices TO admin;



