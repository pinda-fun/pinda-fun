defmodule Api.RoomDatabase do
  # TODO make room_pin come from the PIN generator
  def create_room(admin_id, room_pin) when is_binary(admin_id) and is_binary(room_pin) do
    case DynamicSupervisor.start_child(
           Api.RoomDatabase.DynamicSupervisor,
           {Api.RoomDatabase.Room, %{pin: room_pin, admin_id: admin_id}}
         ) do
      {:ok, _pid} -> {:ok, room_pin}
      {:error, {:already_started, _}} -> {:error, :room_pin_exists}
    end
  end

  def get_room(room_pin) do
    case Registry.lookup(Api.RoomDatabase.Registry, room_pin) do
      [{pid, _}] -> GenServer.call(pid, :get_room)
      [] -> nil
    end
  end

  def add_user_id(user_id, room_pin) when is_binary(user_id) and is_binary(room_pin) do
    case Registry.lookup(Api.RoomDatabase.Registry, room_pin) do
      [{pid, _}] -> GenServer.call(pid, {:add_user_id, user_id})
      [] -> {:error, {:not_found, :room}}
    end
  end

  def remove_user_id(user_id, room_pin) do
    case Registry.lookup(Api.RoomDatabase.Registry, room_pin) do
      [{pid, _}] -> GenServer.call(pid, {:remove_user_id, user_id})
      [] -> {:error, {:not_found, :room}}
    end
  end

  def start_game(room_pin) do
    case Registry.lookup(Api.RoomDatabase.Registry, room_pin) do
      [{pid, _}] -> GenServer.call(pid, :start_game)
      [] -> {:error, {:not_found, :room}}
    end
  end

  def end_game(room_pin) do
    case Registry.lookup(Api.RoomDatabase.Registry, room_pin) do
      [{pid, _}] -> GenServer.call(pid, :end_game)
      [] -> {:error, {:not_found, :room}}
    end
  end

  def add_result(room_pin, client_id, score) do
    case Registry.lookup(Api.RoomDatabase.Registry, room_pin) do
      [{pid, _}] -> GenServer.call(pid, {:add_result, client_id, score})
      [] -> {:error, {:not_found, :room}}
    end
  end

  def redesignate_admin(room_pin) do
    case Registry.lookup(Api.RoomDatabase.Registry, room_pin) do
      [{pid, _}] -> GenServer.call(pid, :redesignate_admin)
      [] -> {:error, {:not_found, :room}}
    end
  end
end
