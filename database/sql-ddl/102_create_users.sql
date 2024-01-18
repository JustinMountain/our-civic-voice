-- Create the 'automations' user
CREATE USER automations WITH PASSWORD 'password';

-- Grant the 'automations' role to the 'populate' user
GRANT admin TO automations;

-- Grant the 'automations' user the ability to connect the 'connections' database
GRANT CONNECT ON DATABASE our_civic_voice TO automations;
