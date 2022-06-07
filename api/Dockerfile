FROM bitwalker/alpine-elixir:1.13.4

WORKDIR /api
RUN mix local.hex --force && mix local.rebar --force

COPY . .
CMD mix deps.get && mix ecto.setup && mix phx.server
