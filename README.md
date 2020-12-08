# pinda-fun

![API Build Status](https://github.com/pinda-fun/pinda-fun/workflows/API%20-%20Elixir/badge.svg)
![Web Build Status](https://github.com/pinda-fun/pinda-fun/workflows/Web%20-%20Node/badge.svg)

## Requirements
- OpenSSL
- Docker

## Getting up and running the dev environment

If this is your first time setting up, run `./scripts/generate_https_keys` first.

Afterwards, simply `docker-compose up`

The frontend is accessible at https://localhost, while the backend is at http://localhost:4000/ or https://localhost:5000/

## CRDT structure
Look at `Web/src/components/room/Meta.ts`

# Web
Production frontend is hosted at https://pinda.fun/

# API
Production backend is hosted at https://sizzling-tiny-wrenchbird.gigalixirapp.com/
