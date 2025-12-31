# Production stage
# We use the artifacts (dist folder) built in the Jenkins pipeline
FROM nginx:alpine

# Copy built assets from local dist folder
COPY dist /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
