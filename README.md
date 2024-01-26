[![Our Civic Voice banner image](/images/banner.jpg "Our Civic Voice")](/images/banner.jpg)

# About

Our Civic Voice is a portal for connecting Canadians with their elected representatives. 

Version 0.1

## Starting the Application

With Docker installed, clone the repo and run `docker compose up` to start the application. 

> Optional: Create a `.env` file in the root directory:

```
# Default values for docker-compose.yaml variables
PG_USERNAME=postgres
PG_PASSWORD=postgres
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=strong-password
```

## Running the Update Scripts

With the containers running, visit `[host.address]:3000/scripts/update/scriptname` in a web browser. The following scriptnames are currently functional:

1. `/all` 
2. `/federal`
3. `/ontario`

These endpoints will extract, transform, and load data for their respective tables.

## Registering the Database with pgAdmin:

> As of version 0.1, the application does not have a UI nor proper REST endpoints. The best way to look at the data stored in the database is via the included pgAdmin container.

Click `Add New Server` on the dashboard or right-click `Servers > Register > Server...`.

On the *General* tab, enter a name for the server.

On the *Connection* tab, fill out the following information:
1. `Host name/address: civic-voice-db` or as appropriate if changed in docker compose file.
2. `Username: postgres` or as declared in `.env` as above.
3. `Password: postgres` or as declared in `.env` as above.

You can now run queries on the database by selecting `Servers > civic-voice-db > Databases > our_civic_voice` and clicking on the Query Tool.

```
# Example queries
SELECT * FROM federal_mps;
SELECT * FROM federal_mp_offices;
DELETE FROM federal_mp_offices;
DELETE FROM federal_mps;
```

## Architecture

Our Civic Voice is still a work in progress. The following represents the MVP architecture that I'm currently working towards:

[![Architecture diagram image](/images/architecture.jpg "Planned Architecture")](/images/architecture.jpg)

### Database Layer

The PostgreSQL database is available within the stack via `civic-voice-db:5432` or externally by exposing port `5432` in the `docker-compose.yaml`.

pgAdmin has been packaged with the application and is available via a web browser at `host-address:8888`.

[Link to README](/database/README.md)

### Data Pipeline Layer

The functions to run the ETL layer are temporarily available via port `3000` on the docker host. 

[Link to README](/data-pipeline/README.md)

### REST API

An express REST API is currently being built behind nginx and is available over HTTP via the docker host.

[Link to README](/express/README.md)
