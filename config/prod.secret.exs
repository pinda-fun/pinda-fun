# In this file, we load production configuration and secrets
# from environment variables. You can also hardcode secrets,
# although such is generally not recommended and you have to
# remember to add this file to your .gitignore.
use Mix.Config

database_url =
  System.get_env("DATABASE_URL") ||
    raise """
    environment variable DATABASE_URL is missing.
    For example: ecto://USER:PASS@HOST/DATABASE
    """

config :api, Api.Repo,
  ssl: true,
  url: database_url,
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")

secret_key_base =
  System.get_env("SECRET_KEY_BASE") ||
    raise """
    environment variable SECRET_KEY_BASE is missing.
    You can generate one by calling: mix phx.gen.secret
    """

config :api, ApiWeb.Endpoint,
  http: [:inet6, port: String.to_integer(System.get_env("PORT") || "4000")],
  secret_key_base: secret_key_base

sentry_dsn =
  System.get_env("SENTRY_DSN") ||
    raise """
    environment variable SENTRY_DSN is missing.
    """

config :sentry,
  dsn: sentry_dsn,
  included_environments: ~w(prod staging),
  environment_name: System.get_env("RELEASE_LEVEL") || "staging",
  enable_source_code_context: true,
  root_source_code_path: File.cwd!()

github_repo =
  System.get_env("GITHUB_REPO") ||
    raise """
    environment variable GITHUB_REPO is missing.
    """

github_username =
  System.get_env("GITHUB_USERNAME") ||
    raise """
    environment variable GITHUB_USERNAME is missing.
    """

github_personal_token =
  System.get_env("GITHUB_PERSONAL_TOKEN") ||
    raise """
    environment variable GITHUB_PERSONAL_TOKEN is missing.
    """

config :api, :github,
  repo: github_repo,
  username: github_username,
  token: github_personal_token

# ## Using releases (Elixir v1.9+)
#
# If you are doing OTP releases, you need to instruct Phoenix
# to start each relevant endpoint:
#
#     config :api, ApiWeb.Endpoint, server: true
#
# Then you can assemble a release by calling `mix release`.
# See `mix help release` for more information.
