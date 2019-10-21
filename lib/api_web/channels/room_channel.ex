defmodule ApiWeb.RoomChannel do
  @moduledoc """
  The channel that manages rooms

  To join a specific room with a pin:
    - Host: %{"name" => name, "game" => game}
    - Non-host: %{"name" => name}
  """

  use ApiWeb, :channel

  alias ApiWeb.Presence

  def join("room:lobby", _payload, socket) do
    case Api.PINGenerator.generate_pin() do
      nil -> {:error, %{reason: "Ran out of PIN"}}
      pin -> {:ok, %{"pin" => pin}, socket}
    end
  end

  def join(topic = "room:" <> _pin, payload = %{"name" => name}, socket) when is_binary(name) do
    try do
      presence_list = Presence.list(socket)

      if Enum.empty?(presence_list) do
        # Host
        case payload do
          %{"game" => game} when is_binary(game) ->
            send(self(), {:after_join, payload})
            {:ok, socket}

          _ ->
            {:error, %{reason: "Bad request"}}
        end
      else
        # Non-host
        send(self(), {:after_join, payload})
        {:ok, socket}
      end
    catch
      # Keep on trying even if Presence does not respond in time
      :exit, _ -> join(topic, payload, socket)
    end
  end

  def join(_, _, _) do
    {:error, %{reason: "Bad request"}}
  end

  def handle_info({:after_join, payload = %{"name" => name}}, socket) when is_binary(name) do
    try do
      presence_list = Presence.list(socket)

      push(socket, "presence_state", Presence.list(socket))

      meta =
        if Enum.empty?(presence_list) do
          %{"game" => game} = payload
          %{"game" => game, "isHost" => true}
        else
          %{"isHost" => false}
        end
        |> Map.put("name", name)

      Presence.track(socket, socket.assigns.client_id, meta)
      {:noreply, socket}
    catch
      :exit, _ ->
        send(self(), :after_join)
        {:noreply, socket}
    end
  end

  # Ignore timed-out GenServer calls
  def handle_info({ref, _}, socket) when is_reference(ref) do
    {:noreply, socket}
  end
end
