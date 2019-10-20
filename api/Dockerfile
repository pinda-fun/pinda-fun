FROM bitwalker/alpine-elixir:1.9.1

WORKDIR /api
RUN mix local.hex --force && mix local.rebar --force

COPY . .
CMD mix deps.get && mix ecto.setup && mix phx.server
