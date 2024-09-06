# Use the official Nginx image as a base
FROM nginx:alpine


# Copy the custom Nginx configuration
COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static files to the Nginx directory
COPY public /usr/share/nginx/html/public
COPY static /usr/share/nginx/html/static

# Copy styles and components to the Nginx html directory under src
COPY static/styles/ /usr/share/nginx/html/styles/
COPY static/srcs/ /usr/share/nginx/html/srcs/

# Expose port 3000
EXPOSE 3000


