import Config

# Configure your database
config :api, Api.Repo,
  username: "postgres",
  password: "postgres",
  database: "api_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :api, ApiWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

config :api, :github, repo: "test/example", username: "john-smith", token: "DEADBEEF"

# Configure the database for GitHub Actions
if System.get_env("GITHUB_ACTIONS") do
  config :app, App.Repo,
    username: "postgres",
    password: "postgres"
end
