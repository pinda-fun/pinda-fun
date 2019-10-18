defmodule ApiWeb.RoomChannel do
  @moduledoc """
  The channel that manages rooms
  """

  use ApiWeb, :channel

  alias ApiWeb.Presence

  def join("room:lobby", _payload, socket) do
    case Api.PINGenerator.generate_pin() do
      nil -> {:error, %{reason: "Ran out of PIN"}}
      pin -> {:ok, %{"pin" => pin}, socket}
    end
  end

  def join("room:" <> _pin, _payload, socket) do
    socket
    |> Presence.list()
    |> Map.get(socket.assigns.client_id)
    |> case do
      nil ->
        send(self(), :after_join)
        {:ok, socket}

      _ ->
        {:error, %{reason: "Existing connection"}}
    end
  end

  def handle_info(:after_join, socket) do
    push(socket, "presence_state", Presence.list(socket))
    {:ok, _} = Presence.track(socket, socket.assigns.client_id, %{})
    {:noreply, socket}
  end
end
