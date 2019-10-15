#!/bin/sh
openssl genrsa 2048 > proxy/server.key
chmod 400 proxy/server.key
yes '' | openssl req -new -x509 -nodes -sha256 -days 365 -key proxy/server.key -out proxy/server.crt
