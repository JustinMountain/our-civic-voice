[![Our Civic Voice banner image](/images/banner.jpg "Our Civic Voice")](/images/banner.jpg)

Our Civic Voice is a portal for connecting Canadians with their elected representatives. 

Version 0.3

## Starting the Application

With Docker installed, clone the repo and run `docker compose up` to start the application. 

> Optional: Rename the `.env-sample` file in the root directory to `.env` and update the environment variables. 

```
# Default values for docker-compose.yaml variables
PG_USERNAME=postgres
PG_PASSWORD=postgres
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=strong-password
```

## Architecture

Our Civic Voice is still a work in progress. The following represents the MVP architecture that I'm currently working on:

[![Architecture diagram image](/images/architecture.jpg "Planned Architecture")](/images/architecture.jpg)

### Database Layer

The PostgreSQL database is available within the stack via `civic-voice-db:5432` or externally by exposing port `5432` in the `docker-compose.yaml`.

pgAdmin has been packaged with the application and is available via a web browser at `host-address:8888`.

[Link to README](/database/README.md)

#### Registering the Database with pgAdmin:

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

### Data Pipeline Layer

The functions running the ETL layer are temporarily available via port `3000` on the docker host. 

[Link to README](/data-pipeline/README.md)

#### Running the Update Scripts

With the containers running, visit `[host.address]:3000/scripts/update/scriptname` in a web browser. The following scriptnames are currently functional:

1. `/all` 
2. `/federal`
3. `/ontario`

These endpoints will extract, transform, and load data for their respective tables.

### REST API

The REST API has been build with Express and is currently available via port `3001` on the docker host.

For a list of the available endpoints, please see the [README](/express/README.md).

### Next.js Frontend

The Next.js frontend is built behind nginx and is available over HTTP via the docker host `http://host.address`.

[Link to README](/frontend/README.md)

#### Exploring the Application

Version 0.3 has included the following endpoints to explore the data in the application:

1. `/browse`
2. `/browse/federal`
3. `/browse/ontario`

Navigating to an individual member's page via these tables will display the relevant information for that member. 
