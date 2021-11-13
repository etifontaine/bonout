# Bonout web-app

## Deployment

### Staging

When you push to the main branch, a Google Cloud Build is triggered. It will build the Dockerfile and push it to the Container Registry. Then, a new revision of the Cloud Run service will be created with the latest image.

### Production

To rollout a new image to production, you simply need to update the revison URL tag on the Cloud Run revision.