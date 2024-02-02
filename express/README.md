# Express REST API

The REST API has been build with Express and is currently available via port `3001` on the docker host.

## REST Endpoints

The following GET endpoints have been established:

For the `/representatives` endpoint:

1. The `/representatives` endpoint returns the information from the *all_representatives* Materialized View. 
2. The `/representatives/federal` endpoint returns the information from the *federal_mps* Table.
3. The `/representatives/federal/:id` endpoint returns the information for a specific member in the *federal_mps* Table.
4. The `/representatives/ontario` endpoint returns the information from the *ontario_mpps* Table.
5. The `/representatives/ontario/:id` endpoint returns the information for a specific member in the *ontario_mpps* Table.

For the `/offices` endpoint:

1. The `/offices/federal/:id` endpoint returns the information for a specific member's office info in the *federal_mp_offices* Table.
2. The `/offices/ontario/:id` endpoint returns the information for a specific member's office info in the *ontario_mpp_offices* Table.
