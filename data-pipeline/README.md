# Data Pipeline Layer

The `data-pipeline` service acts as the ETL layer providing representative contact information for the application. 

The service functions by scraping or collecting information from public sources and placing it in a PostgreSQL database. As of version 0.1, this service also internally exposes REST API endpoints to access the functions from other services.

## Building the Container for Development

The `data-pipeline` layer depends on a database as described by the DDL scripts found at `/database/sq/ddl`. For implementation specifics, please see the  the `civic-voice-db` and `data-pipeline` services from the `docker-compose.yaml` file in the root directory.

The following environment variables (and their default values) are available when running the container: 

```
# .env
DB_HOST=127.0.0.1
DB_NAME=our_civic_voice
DB_PASSWORD=password
```

As of version 0.1, changing the `DB_NAME` and `DB_NAME` environment variables from their default values also requires updating the database and user settings in `/database/sql/ddl`. I'm looking into how to dynamically generate the SQL for this, but haven't come across a simple or elegant solution yet. See [Note on Security](#note-on-security) for more.

## Exposing the Update Scripts

With the service running, visit `[host.address]:3000/scripts/update/scriptname` in a web browser. The following scriptnames are currently functional:

1. `/all` 
2. `/federal`
3. `/ontario`

These endpoints will extract, transform, and load data for their respective tables.

## Note on Security

I'm aware of the following security quirks that are worth discussing and ruminating on:

1) The update scripts are available over HTTP GET requests.
2) The automations user has a magic password.

This is not ideal and this section exists to provide context for this decision.

The data-pipeline functions have been envisioned as Lambda endpoints. To that end, I chose this as a means of quickly emulating similar functionality as I continue to develop the application. I expect that by the time this is hosted, the application stack will be behind nginx and the `data-pipeline` service will only be accessible via admin users of the front-end portion of the site, further mitigating any security risks.

Please reach out if you're reading this and think there's something I'm missing; security (and user authentication in particular) is something I'm eager to learn more about.
