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

  def join(topic = "room:" <> _pin, payload, socket) do
    try do
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
    catch
      # Keep on trying even if Presence does not respond in time
      :exit, _ -> join(topic, payload, socket)
    end
  end

  def handle_info(:after_join, socket) do
    try do
      push(socket, "presence_state", Presence.list(socket))
      Presence.track(socket, socket.assigns.client_id, %{})
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
