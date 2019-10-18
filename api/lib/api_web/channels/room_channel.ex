defmodule ApiWeb.RoomChannel do
  @moduledoc """
  The channel that manages rooms
  """

  use ApiWeb, :channel

  alias ApiWeb.Presence

  def join("room:lobby", _payload, socket) do
    with {:presence, nil} <-
           {:presence, Presence.list(socket) |> Map.get(socket.assigns.client_id)},
         {:pin, pin} when is_binary(pin) <- {:pin, Api.PINGenerator.generate_pin()} do
      {:ok, %{"pin" => pin}, socket}
    else
      {:presence, _} -> {:error, %{reason: "Existing connection"}}
      {:pin, nil} -> {:error, %{reason: "Ran out of PIN"}}
    end
  end

  def join("room:" <> _pin, _payload, socket) do
    send(self(), :after_join)
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    IO.inspect(Presence.list(socket))
    push(socket, "presence_state", Presence.list(socket))
    {:ok, _} = Presence.track(socket, socket.assigns.client_id, %{})
    {:noreply, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).
  def handle_in("shout", payload, socket) do
    broadcast(socket, "shout", payload)
    {:noreply, socket}
  end
end
