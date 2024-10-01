# Use the official Nginx image as a base
FROM nginx:1.27.1-alpine

# Install dependencies
RUN apk update && apk add --no-cache openssl

# Copy the custom Nginx configuration
COPY conf/nginx.conf /etc/nginx/nginx.conf

# Copy the SSL generation script
COPY ./conf/tools/generate_ssl.sh /usr/local/bin/generate_ssl.sh
RUN chmod +x /usr/local/bin/generate_ssl.sh

RUN /usr/local/bin/generate_ssl.sh

# Copy the public directory to the Nginx html directory
COPY public/ /usr/share/nginx/html/public
RUN chmod 777 /usr/share/nginx/html/public
RUN chmod 777 /usr/share/nginx/html/public/index.html
RUN chmod 777 /usr/share/nginx/html/public/pong.jpg
COPY static /usr/share/nginx/html/static

# Copy styles and components to the Nginx html directory under src
COPY static/styles/ /usr/share/nginx/html/styles/
COPY static/srcs/ /usr/share/nginx/html/srcs/

# Expose port 3000
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]