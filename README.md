# Our Civic Voice

Our Civic Voice is an open-source portal for connecting Canadians with their elected representatives. 

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

With every member page catalogued, I need to gather info from the XML on each page

, scrape for the info if not... the CSV looks disorganizaed at quick glance

Contact info will need to be scraped

```
# How I got all their contact info in Python
https://github.com/JustinMountain/civic-voice-old/blob/main/civiccrawlers/civiccrawlers/spiders/FederalMPContacts.py
```

Once I have an idea of all the data I've collected, I need to find a way to organize it into the necessary tables.

Think about adding tags for ministers and whatnot.

Should add Ontario Ministers and Committee members...

Make a MV to serve this data easier

I need a function to limit the number of valid CSVs kept

UI will need a way to interact with DB population

###### Super Important

1. Review console.log messages and color code

1. Better comments (JSDoc?)
1. Pull out all passwords and make them valid

1. Can I create "serverless"-like functionality via Docker?
 - Maybe I can hack it by setting restart to 24 hours and having the app run on startup

1. The app doesn't currently populate automatically on startup, find a way to call init.ts

1. Create some cool things to log (first stretch goal)
