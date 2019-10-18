defmodule Api.RoomDatabase.Room do
  @enforce_keys [:pin, :admin_id]
  defstruct pin: nil, admin_id: nil, user_ids: MapSet.new()

  @type t :: %__MODULE__{pin: String.t(), user_ids: MapSet.t()}

  use GenServer, restart: :transient

  @impl true
  def init(%{pin: pin, admin_id: admin_id}) when is_binary(pin) and is_binary(admin_id) do
    {:ok, %__MODULE__{pin: pin, admin_id: admin_id}}
  end

  @impl true
  def handle_call(:get_room, _from, state = %__MODULE__{}) do
    {:reply, state, state}
  end

  @impl true
  def handle_call({:add_user_id, user_id}, _from, state = %__MODULE__{user_ids: user_ids}) do
    user_ids = MapSet.put(user_ids, user_id)
    state = %{state | user_ids: user_ids}
    {:reply, {:ok, state}, state}
  end

  @impl true
  def handle_call({:remove_user_id, user_id}, _from, state = %__MODULE__{user_ids: user_ids}) do
    user_ids = MapSet.delete(user_ids, user_id)
    state = %{state | user_ids: user_ids}
    {:reply, {:ok, state}, state}
  end

  def start_link(args = %{pin: pin, admin_id: admin_id})
      when is_binary(pin) and is_binary(admin_id) do
    GenServer.start_link(__MODULE__, args,
      name: {:via, Registry, {Api.RoomDatabase.Registry, pin}}
    )
  end
end
