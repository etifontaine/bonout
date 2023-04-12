# Bonout web-app

## Installation

**Node.js 16.15.0 is required**

> Recommended Node.js version: 18 (LTS)

```sh-session
npm install
```

## Development

```sh-session
npm run dev
```

And then open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

## Deployment

### Staging

When you push to the main branch, a Google Cloud Build is triggered. It will build the Dockerfile and push it to the Container Registry. Then, a new revision of the Cloud Run service will be created with the latest image.

### Production

To rollout a new image to production, you simply need to update the revison URL tag on the Cloud Run revision.
