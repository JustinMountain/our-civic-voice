-- Connect to the 'connections' database
\c our_civic_voice;

CREATE ROLE automations_user WITH PASSWORD 'password' LOGIN;
CREATE ROLE express_user WITH PASSWORD 'password' LOGIN;

GRANT automations TO automations_user;
GRANT express TO express_user;

GRANT CONNECT ON DATABASE our_civic_voice TO automations_user;
GRANT CONNECT ON DATABASE our_civic_voice TO express_user;
