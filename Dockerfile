FROM node:8

ENV SERVICE_PORT 4000

# Uncomment the following lines to you provide a URL to retrieve the certificates
# ENV TLS_ENABLED true
# ENV SERVICE_SSL_CERT_PATH '/usr/src/ssl'
# ENV SSL_CERTS_URL "REPLACE THIS FOR A VALID URL THAT CONTAINS THE CERTIFICATES"
# RUN mkdir -p $SERVICE_SSL_CERT_PATH \
#     && curl -o $SERVICE_SSL_CERT_PATH/info-nl.key $SSL_CERTS_URL/key.pem \
#     && curl -o $SERVICE_SSL_CERT_PATH/info-nl.crt $SSL_CERTS_URL/cert.pem

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production

COPY . .
EXPOSE $SERVICE_PORT
CMD [ "npm", "start" ]
