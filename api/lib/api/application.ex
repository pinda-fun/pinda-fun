defmodule Api.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, args) do
    # List all child processes to be supervised
    children =
      [
        # Start the endpoint when the application starts
        ApiWeb.Endpoint,
        Api.RoomDatabase.Supervisor
        # Starts a worker by calling: Api.Worker.start_link(arg)
        # {Api.Worker, arg},
      ] ++ env_dependent_children(args)

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

  defp env_dependent_children(args) do
    case Keyword.get(args, :env) do
      :test -> []
      _ -> [Api.PINGenerator]
    end
  end
end
