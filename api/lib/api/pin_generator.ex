defmodule Api.PINGenerator do
  @moduledoc """
  GenServer for generating PIN's
  """

  @enforce_keys [:available]
  defstruct available: nil, taken: MapSet.new()

  @type t :: %__MODULE__{available: MapSet.t(), taken: MapSet.t()}

  @num_digits 4
  @range 0..((:math.pow(10, @num_digits) |> round()) - 1)
  @max_num_pins Enum.count(@range)

  @cleanup_interval 10_000

  use GenServer

  alias ApiWeb.Presence

  require Logger

  @impl true
  def init(_) do
    pins =
      @range
      |> Enum.map(fn pin ->
        pin |> to_string() |> String.pad_leading(4, "0")
      end)
      |> MapSet.new()

    Process.send_after(self(), :cleanup, @cleanup_interval)

    {:ok, %__MODULE__{available: pins}}
  end

  @impl true
  def handle_call(:generate, _from, state = %__MODULE__{available: available, taken: taken}) do
    if Enum.empty?(available) do
      {:reply, nil, state}
    else
      [pin] = Enum.take(available, 1)
      available = MapSet.delete(available, pin)
      taken = MapSet.put(taken, pin)
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

  @impl true
  def handle_call({:mark_unavailable, pin}, _from, state) do
    case do_mark_unavailable(pin, state) do
      {:ok, new_state} -> {:reply, :ok, new_state}
      :error -> {:reply, :error, state}
    end
  end

  @impl true
  def handle_call(:has_pin?, _from, state = %__MODULE__{available: available}) do
    {:reply, not Enum.empty?(available), state}
  end

  defp do_mark_available(pin, %__MODULE__{available: available, taken: taken}) do
    if MapSet.member?(taken, pin) do
      taken = MapSet.delete(taken, pin)
      available = MapSet.put(available, pin)
      {:ok, %__MODULE__{available: available, taken: taken}}
    else
      :error
    end
  end

  defp do_mark_unavailable(pin, %__MODULE__{available: available, taken: taken}) do
    if MapSet.member?(available, pin) do
      available = MapSet.delete(available, pin)
      taken = MapSet.put(taken, pin)
      {:ok, %__MODULE__{available: available, taken: taken}}
    else
      :error
    end
  end

  @impl true
  def handle_info(:cleanup, %__MODULE__{available: available, taken: taken}) do
    result =
      Enum.group_by(taken, fn pin ->
        # When Presence timed out, assume pin is still taken
        case Presence.safe_list("room:#{pin}") do
          {:ok, presences} -> Enum.empty?(presences)
          {:error, :timeout} -> false
        end
      end)

    can_be_freed = result |> Map.get(true, []) |> MapSet.new()
    taken = result |> Map.get(false, []) |> MapSet.new()

    available = MapSet.union(can_be_freed, available)

    Logger.info("#{__MODULE__}: Cleaning up rooms, #{MapSet.size(can_be_freed)} freed")

    Process.send_after(self(), :cleanup, @cleanup_interval)
    {:noreply, %__MODULE__{available: available, taken: taken}}
  end

  # Ignore timed-out GenServer call to Presence
  @impl true
  def handle_info({ref, _}, state) when is_reference(ref) do
    {:noreply, state}
  end

  def start_link(opts) do
    GenServer.start_link(__MODULE__, nil, opts)
  end

  # CLIENT FUNCTIONS
  @doc """
  Generates PIN or returns `nil` if there is no more PIN available.
  """
  @spec generate_pin(GenServer.server()) :: String.t() | nil
  def generate_pin(pin_generator \\ __MODULE__) do
    GenServer.call(pin_generator, :generate)
  end

  @doc """
  Marks a PIN as being available again.

  Returns `:ok` if this succeeds,
  or `:error` if this PIN was not generated of the system or has been marked as available.
  """
  @spec mark_pin_as_available(String.t()) :: :ok | :error
  def mark_pin_as_available(pin, pin_generator \\ __MODULE__) do
    GenServer.call(pin_generator, {:mark_available, pin})
  end

  @spec mark_pin_as_unavailable(String.t()) :: :ok | :error
  def mark_pin_as_unavailable(pin, pin_generator \\ __MODULE__) do
    GenServer.call(pin_generator, {:mark_unavailable, pin})
  end

  @spec has_pin?(GenServer.server()) :: boolean()
  def has_pin?(pin_generator \\ __MODULE__) do
    GenServer.call(pin_generator, :has_pin?)
  end

  def max_num_pins, do: @max_num_pins
end
