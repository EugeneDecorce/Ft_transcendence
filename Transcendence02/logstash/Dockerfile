FROM docker.elastic.co/logstash/logstash:7.17.9

# Copy the SSL generation script
COPY ./conf/tools/generate_ssl.sh /usr/local/bin/generate_ssl.sh
# RUN chmod +x /usr/local/bin/generate_ssl.sh

# RUN /usr/local/bin/generate_ssl.sh