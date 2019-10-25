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

  def handle_in(msg = "start", payload, socket) do
    client_id = socket.assigns.client_id

    with {:ok, presences} <- Presence.safe_list(socket),
         %{metas: [%{"isHost" => true}]} <- Map.get(presences, client_id),
         {:ok, _} <-
           Presence.safe_update(socket, client_id, fn meta -> %{meta | "isStart" => true} end) do
      {:noreply, socket}
    else
      %{metas: [%{"isHost" => false}]} ->
        {:reply, {:error, %{reason: "Only host can perform this"}}, socket}

      {:error, :timeout} ->
        handle_in(msg, payload, socket)
    end
  end

  def handle_in(msg = "stop", payload, socket) do
    client_id = socket.assigns.client_id

    with {:ok, presences} <- Presence.safe_list(socket),
         %{metas: [%{"isHost" => true}]} <- Map.get(presences, client_id),
         {:ok, _} <-
           Presence.safe_update(socket, client_id, fn meta -> %{meta | "isStart" => false} end) do
      {:noreply, socket}
    else
      %{metas: [%{"isHost" => false}]} ->
        {:reply, {:error, %{reason: "Only host can perform this"}}, socket}

      {:error, :timeout} ->
        handle_in(msg, payload, socket)
    end
  end

  def handle_in(_, _, socket) do
    {:reply, {:error, %{reason: "Bad request"}}, socket}
  end
end
