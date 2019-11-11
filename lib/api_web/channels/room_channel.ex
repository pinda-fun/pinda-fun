defmodule ApiWeb.RoomChannel do
  @moduledoc """
  The channel that manages rooms

  To join a specific room with a pin:
    - Host: { name: string, game: string }
    - Non-host: { name: string }
  """

  use ApiWeb, :channel

  alias ApiWeb.Presence

  def join(topic = "room:lobby", payload, socket) do
    try do
      case Api.PINGenerator.generate_pin() do
        nil -> {:error, %{reason: "Ran out of PIN"}}
        pin -> {:ok, %{"pin" => pin}, socket}
      end
    catch
      :exit, _ -> join(topic, payload, socket)
    end
  end

  def join(topic = "room:" <> _pin, payload = %{"name" => name}, socket) when is_binary(name) do
    case Presence.safe_list(socket) do
      {:ok, presences} ->
        if Map.has_key?(presences, socket.assigns.client_id) do
          {:error, %{reason: "Existing connection"}}
        else
          join(topic, payload, socket, if(Enum.empty?(presences), do: :host, else: :non_host))
        end

      {:error, :timeout} ->
        # Retry again
        join(topic, payload, socket)
    end
  end

  def join(_, _, _) do
    {:error, %{reason: "Bad request"}}
  end

  defp join("room:" <> pin, payload = %{"name" => name, "game" => game}, socket, :host)
       when is_binary(name) and is_binary(game) do
    Api.PINGenerator.mark_pin_as_unavailable(pin)
    send(self(), {:after_join, :host, payload})
    {:ok, socket}
  end

  defp join(_, %{"name" => name}, _, :host) when is_binary(name) do
    {:error, %{reason: "Room with that PIN does not exist"}}
  end

  defp join(_topic, payload = %{"name" => name}, socket, :non_host) when is_binary(name) do
    send(self(), {:after_join, :non_host, payload})
    {:ok, socket}
  end

  defp join(_, _, _, _) do
    {:error, %{reason: "Bad request"}}
  end

  def handle_info(msg = {:after_join, type, payload}, socket) when type in [:host, :non_host] do
    case Presence.safe_list(socket) do
      {:ok, presences} ->
        push(socket, "presence_state", presences)
        Presence.track(socket, socket.assigns.client_id, Presence.meta(type, payload))
        {:noreply, socket}

      {:error, :timeout} ->
        handle_info(msg, socket)
    end
  end

  # Ignore timed-out GenServer calls
  def handle_info({ref, _}, socket) when is_reference(ref) do
    {:noreply, socket}
  end

  def handle_in(msg, payload, socket) when is_map(payload) do
    if Map.has_key?(payload, msg) do
      do_update_presence(msg, payload[msg], socket)
    else
      handle_in(nil, nil, socket)
    end
  end

  def handle_in(_, _, socket) do
    {:reply, {:error, %{reason: "Bad request"}}, socket}
  end

  defp do_update_presence(key, new_value, socket) do
    updater = fn meta ->
      if Map.has_key?(meta, key), do: %{meta | key => new_value}, else: meta
    end

    case Presence.safe_update(socket, socket.assigns.client_id, updater) do
      {:ok, _ref} -> {:reply, :ok, socket}
      {:error, :timeout} -> do_update_presence(key, new_value, socket)
    end
  end
end
