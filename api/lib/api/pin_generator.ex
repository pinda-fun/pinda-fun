defmodule Api.PINGenerator do
  @moduledoc """
  GenServer for generating PIN's
  """

  @num_digits 4
  @range 0..((:math.pow(10, @num_digits) |> round()) - 1)
  @max_num_pins Enum.count(@range)

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
  def handle_call(:generate, _from, state = %{available: available, taken: taken}) do
    case available do
      [] ->
        {:reply, nil, state}

      [pin | available] ->
        taken = MapSet.put(taken, pin)
        {:reply, pin, %{available: available, taken: taken}}
    end
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

  def start_link(opts \\ [name: __MODULE__]) do
    GenServer.start_link(__MODULE__, nil, opts)
  end

  # CLIENT FUNCTIONS
  @doc """
  Generates PIN or returns `nil` if there is no more PIN available.
  """
  @spec generate_pin :: String.t() | nil
  def generate_pin(pin_generator \\ __MODULE__) do
    GenServer.call(pin_generator, :generate)
  end

  @doc """
  Marks a PIN as being available again.

  Returns `:ok` if this succeeds,
  or `:error` if this PIN was not generated of the system or has been marked as available.
  """
  @spec mark_pin_as_available(String.t()) :: :ok | {:error, atom()}
  def mark_pin_as_available(pin, pin_generator \\ __MODULE__) do
    GenServer.call(pin_generator, {:mark_available, pin})
  end

  def max_num_pins, do: @max_num_pins
end
