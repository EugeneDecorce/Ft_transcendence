#!/bin/sh

# Create directories if they don't exist
mkdir -p /etc/ssl/certs /etc/ssl/private

# Generate a self-signed SSL certificate for Kibana
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/kibana.key \
    -out /etc/ssl/certs/kibana.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=Department/CN=localhost"