# Data Pipeline Layer

## Building the Dockerfile for Dev

```
# Run from /data-pipeline
docker build -t <container-name> .
docker run -e DB_HOST=civic-voice-db --network=our-civic-voice_ocv-network <container-name>
```
