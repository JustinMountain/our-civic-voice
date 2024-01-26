CREATE USER automations WITH PASSWORD 'password';
CREATE USER express WITH PASSWORD 'password';

GRANT admin TO automations;
GRANT admin TO express;

GRANT CONNECT ON DATABASE our_civic_voice TO automations;
GRANT CONNECT ON DATABASE our_civic_voice TO express;
