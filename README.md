# Our Civic Voice

Our Civic Voice is an open-source portal for connecting Canadians with their elected representatives. 

## Database

Currently utilizing Postgres and pgAdmin managed via docker and docker compose. 

Please run `docker compose up -d` to setup the database before running the application.

When adding the server to pgAdmin, find the IP address of the database via `docker inspect <container>`. It was `172.26.0.2` on my first install, will confirm/check.

## Work in Progress

### Phase 1

The first phase will involve setting up the database and access to its contents. 

1. Setup crawler for Ontario MPP into DB
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

### Up Next

1. Ensure the header row is as expected before populating the DB
2. Loop over each row, populating the db

*I need this script to run the script to drop tables for testing.*

I need to add NOT NULL to appropriate attributes in DB creation step

### Useful Commands

```
# Clears the DB to start fresh for testing
docker network prune && docker volume prune -a
```

```
# Run the test.ts file
ts-node test.ts
```
