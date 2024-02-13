# Next.js Frontend

The Next.js frontend is currently built behind nginx and is available over HTTP via the docker host `http://host.address`.

## Information Availability

As of Version 0.3, the Frontend has been built out for users to browse through the contact information for elected representatives from the Federal level, as well as Ontario Provincial representatives.

The following endpoints have been established:

1. The `/browse` endpoint displays the information for all representatives currently in the datase. 
2. The `/browse/federal` endpoint displays the information for Federal MPs.
3. The `/browse/federal/:id` endpoint displays the contact information for a specific Federal MP.
4. The `/browse/ontario` endpoint displays the information for Ontario MPPs.
5. The `/browse/ontario/:id` endpoint displays the contact information for a specific Ontario MPP.
6. The root endpoint, `/`, currently displays ta placeholder form users will use to get directed to the appropriate represenative as well as the same table found on `/browse`.

## Towards the MVP

Version 0.4 will focus on Data Layer Updates which will result in an information presentation update as well as santizing the info so it is displayed similarly for all endpoints.  

The Data Layer Update will also update the placeholder form to work for a select number of complaints. 
