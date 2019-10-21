defmodule ApiWeb.RoomChannel do
  @moduledoc """
  The channel that manages rooms

  To join a specific room with a pin:
    - Host: %{"name" => name, "game" => game}
    - Non-host: %{"name" => name}
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
        join(topic, payload, socket, if(Enum.empty?(presences), do: :host, else: :non_host))

      {:error, :timeout} ->
        # Retry again
        join(topic, payload, socket)
    end
  end

  defp join(_topic, payload = %{"name" => name, "game" => game}, socket, :host)
       when is_binary(name) and is_binary(game) do
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
        Presence.track(socket, socket.assigns.client_id, meta(type, payload))
        {:noreply, socket}

      {:error, :timeout} ->
        handle_info(msg, socket)
    end
  end

  # Ignore timed-out GenServer calls
  def handle_info({ref, _}, socket) when is_reference(ref) do
    {:noreply, socket}
  end

  defp meta(:host, %{"name" => name, "game" => game}) do
    %{"name" => name, "game" => game, "isHost" => true}
  end

  defp meta(:non_host, %{"name" => name}) do
    %{"name" => name, "isHost" => false}
  end
end
