# Our Civic Voice

Our Civic Voice is an open-source portal for connecting Canadians with their elected representatives. 

## Running the Application

```
# Start the containers
docker compose up
```

Optional: Create a `.env` file in the root directory:

```
# Default values for docker-compose.yaml variables
PG_USERNAME=postgres
PG_PASSWORD=postgres
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=strong-password
```

### Running the Update Scripts

With the containers running, visit `[host.address]:3000/scripts/update/scriptname` in a web browser. The following scriptnames are currently functional:

1. `/all` 
2. `/federal`
3. `/ontario`

These endpoints will extract, transform, and load data for their respective tables.

### Registering the Server with pgAdmin:

Click `Add New Server` on the dashboard or right-click `Servers > Register > Server...`.

On the *General* tab, enter a name for the server.

On the *Connection* tab, fill out the following information:
1. `Host name/address: civic-voice-db` or as appropriate if changed in docker compose file.
2. `Username: postgres` or as declared in `.env` as above.
3. `Password: postgres` or as declared in `.env` as above.

You can now run queries on the database by selecting `Servers > civic-voice-db > Databases > our_civic_voice` and clicking on the Query Tool.

```
SELECT * FROM federal_mps;
SELECT * FROM federal_mp_offices;
SELECT * FROM ontario_mpps;
SELECT * FROM ontario_mpp_offices;
```

Note: This will only work after I finish dockerizing the app as it exists!

## Redo Below:

## Database

Currently utilizing Postgres and pgAdmin managed via docker and docker compose. 

Please run `docker compose up -d` to setup the database before running the application.

When adding the server to pgAdmin, find the IP address of the database via `docker inspect <container>`. It was `172.26.0.2` on my first install, will confirm/check.

## Work in Progress

### Phase 1

The first phase will involve setting up the database and access to its contents. 

~~1. Setup crawler for Ontario MPP into DB~~
2. Setup crawler for Federal MPs into DB
3. Setup automation to check for updates from source to DB
4. Setup API for DB access
5. Setup simple, searchable webfront table for info
6. Add all provinces
7. Add Federal cabinet members

Once this phase is complete, users should have access to a complete list of Provincial and Federal elected officials. User should also be able to search through this list by location, name, and position. 

### Phase 2

The second phase will involve setting up a database of issues one might want to contact their representatives for. 

Users will be able to search for different issues and be told the appropriate level of government to reach out to. 

Once this functionality is established, the functionality from Phases 1 and 2 will be combined. This will be done through a simple portal where users will enter their location and issue and be notified of the correct persons of contact. 

The completion of Phase 2 will represent the MVP.

### Phase 3 and Beyond

The plan for moving passed the MVP involves setting up a user-driven database for sample communications, adding templates for use in connecting with representatives. 

### Useful Commands

```
# Clears the DB to start fresh for testing
docker network prune && docker volume prune -a
```

```
# Run the populateOntario.ts.ts file
ts-node populateOntario.ts.ts
```

### Up Next

Think about adding tags for ministers and whatnot

Should add committees

Make a MV to serve this data easier

UI will need a way to interact with DB population
