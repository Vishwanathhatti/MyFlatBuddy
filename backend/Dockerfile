FROM node:18

WORKDIR /app

# We are copying the pre-installed node_modules from the Jenkins workspace
# ensuring consistent architecture with the 'node' container used in the pipeline.
COPY . .

EXPOSE 35512

CMD ["node", "index.js"]
