defmodule Api.PINGenerator do
  @moduledoc """
  GenServer for generating PIN's
  """

  @enforce_keys [:available]
  defstruct available: nil, taken: MapSet.new()

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

    {:ok, %__MODULE__{available: pins}}
  end

  @impl true
  def handle_call(:generate, _from, state = %__MODULE__{available: available, taken: taken}) do
    case available do
      [] ->
        {:reply, nil, state}

      [pin | available] ->
        taken = MapSet.put(taken, pin)
        Process.send_after(self(), {:cleanup, pin}, 10_000)
        {:reply, pin, %__MODULE__{available: available, taken: taken}}
    end
  end

  @impl true
  def handle_call({:mark_available, pin}, _from, state) do
    case do_mark_available(pin, state) do
      {:ok, new_state} -> {:reply, :ok, new_state}
      :error -> {:reply, :error, state}
    end
  end

  defp do_mark_available(pin, %__MODULE__{available: available, taken: taken}) do
    if MapSet.member?(taken, pin) do
      taken = MapSet.delete(taken, pin)
      available = [pin | available]
      {:ok, %__MODULE__{available: available, taken: taken}}
    else
      :error
    end
  end

  @impl true
  def handle_info({:cleanup, pin}, state = %__MODULE__{}) do
    # Check whether the given room is actually taken
    # If it is not, then free the pin up.
    with nil <- Api.RoomDatabase.get_room(pin),
         {:ok, new_state} <- do_mark_available(pin, state) do
      {:noreply, new_state}
    else
      %Api.RoomDatabase.Room{} -> {:noreply, state}
      :error -> {:noreply, state}
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
