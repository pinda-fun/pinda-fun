defmodule Api.RoomDatabase.Supervisor do
  @moduledoc """
  Supervises processes related to RoomDatabase.
  """

  use Supervisor

  def start_link(_opts) do
    Supervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  @impl true
  def init(:ok) do
    children = [
      {DynamicSupervisor, strategy: :one_for_one, name: Api.RoomDatabase.DynamicSupervisor},
      {Registry, keys: :unique, name: Api.RoomDatabase.Registry}
    ]

    Supervisor.init(children, strategy: :one_for_all)
  end
end
