# Database Layer

The database layer has been built with PostgreSQL and is packaged with pgAdmin. The database definitions can be found in `/sql/ddl/`.

## Entity Relationship Diagrams

### Federal ERD

[![Federal ERD image](/database/images/erd-federal.jpg "Federal Entity Relationship Diagram")](/images/erd-federal.jpg)

### Ontario ERD

[![Ontario ERD image](/database/images/erd-ontario.jpg "Ontario Entity Relationship Diagram")](/images/erd-ontario.jpg)

### Materialized Views

[![Materialized View image](/database/images/erd-ontario.jpg "Materialized View Diagram")](/images/erd-ontario.jpg)


## Useful Queries

The following queries are useful while searching the Database via pgAdmin:

```
# Tables
SELECT * FROM federal_mps;
SELECT * FROM ontario_mpps;
SELECT * FROM federal_mp_offices;
SELECT * FROM ontario_mpp_offices;

# Materialized Views
SELECT * FROM all_representatives;
```
