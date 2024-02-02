# Next.js Frontend

The Next.js frontend is currently being built behind nginx and is available over HTTP via the docker host `http://host.address`.

## Information Availability

As of Version 0.2, the Frontend has been built out for users to browse through the contact information for elected representatives from the Federal level, as well as Ontario Provincial representatives.

The following endpoints have been established:

1. The `/browse` endpoint displays the information for all representatives currently in the datase. 
2. The `/browse/federal` endpoint displays the information for Federal MPs.
3. The `/browse/federal/:id` endpoint displays the contact information for a specific Federal MP.
4. The `/browse/ontario` endpoint displays the information for Ontario MPPs.
5. The `/browse/ontario/:id` endpoint displays the contact information for a specific Ontario MPP.
6. `/` currently displays the same information as `/browse`

## Towards the MVP

Version 0.3 will focus on building out the frontend portion of Our Civic Voice, with most of the focus being on this service. 
