defmodule Api.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    # List all child processes to be supervised
    children = [
      # Start the Ecto repository
      Api.Repo,
      # Start the endpoint when the application starts
      ApiWeb.Endpoint,
      ApiWeb.Presence,
      {Api.PINGenerator, name: Api.PINGenerator}
      # Starts a worker by calling: Api.Worker.start_link(arg)
      # {Api.Worker, arg},
    ]

    # Use :one_for_all strategy to clean up all states should anything crash
    opts = [strategy: :one_for_all, name: Api.Supervisor]

    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    ApiWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
