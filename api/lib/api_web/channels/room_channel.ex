defmodule ApiWeb.RoomChannel do
  @moduledoc """
  The channel that manages rooms
  """

  alias Api.RoomDatabase
  alias Api.RoomDatabase.Room

  use ApiWeb, :channel

  def join("room:lobby", payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def join("room:5432", _payload, socket) do
    case RoomDatabase.add_user_id(socket.assigns.client_id, "5432") do
      {:ok, %Room{}} -> {:ok, socket}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  # def handle_in("ping", payload, socket) do
  #   {:reply, {:ok, payload}, socket}
  # end

  # # It is also common to receive messages from the client and
  # # broadcast to everyone in the current topic (room:lobby).
  # def handle_in("shout", payload, socket) do
  #   broadcast(socket, "shout", payload)
  #   {:noreply, socket}
  # end

  def handle_in("startGame", _payload, socket) do
    RoomDatabase.start_game("5432")
    Process.send_after(self(), :end_game, 22_500)
    broadcast(socket, "startGame", %{})
    {:noreply, socket}
  end

  def handle_in("result", %{"score" => score}, socket) do
    RoomDatabase.add_result("5432", socket.assigns.client_id, score)
    {:noreply, socket}
  end

  # catch all to prevent crash
  def handle_in(_, _, socket) do
    {:noreply, socket}
  end

  def handle_info(:end_game, socket) do
    case RoomDatabase.get_room("5432") do
      %Room{game_on?: false} ->
        {:noreply, socket}

      %Room{result: result} ->
        RoomDatabase.end_game("5432")

        sorted_result =
          result
          |> Enum.sort_by(fn {score, _} -> score end)
          |> Enum.map(fn {score, client_id} -> [score, client_id] end)

        broadcast(socket, "result", %{"result" => sorted_result})
        {:noreply, socket}
    end
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
