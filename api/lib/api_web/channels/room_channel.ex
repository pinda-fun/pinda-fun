defmodule ApiWeb.RoomChannel do
  @moduledoc """
  The channel that manages rooms
  """

  use ApiWeb, :channel

  def join("room:lobby", _payload, socket) do
    case Api.PINGenerator.generate_pin() do
      nil -> {:error, %{reason: "Ran out of PIN"}}
      pin -> {:ok, %{"pin" => pin}, socket}
    end
  end

  def join("room:" <> pin, _payload, socket) do
    Api.RoomDatabase.add_user_id(pin, socket.assigns.client_id)
    {:ok, socket}
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
