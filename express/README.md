# Express REST API

The Express REST API is being built behind nginx and is available over HTTP via the docker host. 

## REST Endpoints

The following GET endpoints need to be created:

1. The `/representatives/` endpoint will require a Materialized View with *Honorific*, *Constituency*, *Prov/Territory*, and *Party*, as well as the *Level of Government*. 
2. The `/representatives/federal`endpoint should only respond with Federal MPs.
3. The `/representatives/ontario`endpoint should only respond with Ontario MPPs.
4. The `/representatives/:constituency`endpoint should respond with each of the offices associated with the respective constituency.

> This assumes that the constituencies all have different names at the federal and provincial levels. 
