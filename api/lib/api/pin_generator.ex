defmodule Api.PINGenerator do
  @moduledoc """
  GenServer for generating PIN's
  """

  @range 0..9999

  use GenServer

  @impl true
  def init(_) do
    pins =
      @range
      |> Enum.map(fn pin ->
        pin |> to_string() |> String.pad_leading(4, "0")
      end)
      |> Enum.shuffle()

    {:ok, %{available: pins, taken: MapSet.new()}}
  end

  @impl true
  def handle_call(:generate, _from, %{available: available, taken: taken}) do
    [pin | available] = available
    taken = MapSet.put(taken, pin)
    {:reply, pin, %{available: available, taken: taken}}
  end

  @impl true
  def handle_call({:mark_available, pin}, _from, state = %{available: available, taken: taken}) do
    if MapSet.member?(taken, pin) do
      taken = MapSet.delete(taken, pin)
      available = [pin | available]
      {:reply, :ok, %{available: available, taken: taken}}
    else
      {:reply, :error, state}
    end
  end

  def start_link(_) do
    GenServer.start_link(__MODULE__, nil, name: __MODULE__)
  end

  # CLIENT FUNCTIONS
  @doc """
  Generates PIN or returns `nil` if there is no more PIN available.
  """
  @spec generate_pin :: String.t() | nil
  def generate_pin do
    GenServer.call(__MODULE__, :generate)
  end

  @doc """
  Marks a PIN as being available again.

  Returns `:ok` if this succeeds,
  or `:error` if this PIN was not generated of the system or has been marked as available.
  """
  @spec mark_pin_as_available(String.t()) :: :ok | {:error, atom()}
  def mark_pin_as_available(pin) do
    GenServer.call(__MODULE__, {:mark_available, pin})
  end
end
