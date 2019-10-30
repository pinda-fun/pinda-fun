defmodule ApiWeb.FeedbackChannel do
  use ApiWeb, :channel

  def join(
        "feedback:" <> client_id,
        _payload,
        socket = %Phoenix.Socket{assigns: %{client_id: client_id}}
      ) do
    {:ok, socket}
  end

  def join(_, _, _) do
    {:error, %{reason: "Bad request"}}
  end

  def handle_in(
        "submitResult",
        payload = %{"game" => game, "title" => title, "body" => body, "isGood" => isGood},
        socket
      )
      when is_binary(game) and is_binary(title) and is_binary(body) and is_boolean(isGood) do
    Task.start(fn -> submit_feedback(socket.assigns.client_id, payload) end)
    {:reply, :ok, socket}
  end

  def handle_in(_, _, socket) do
    {:reply, {:error, %{reason: "Bad request"}}, socket}
  end

  defp submit_feedback(
         client_id,
         payload = %{
           "game" => game,
           "title" => title,
           "body" => body,
           "isGood" => isGood
         }
       )
       when is_binary(client_id) and is_binary(game) and is_binary(title) and is_binary(body) and
              is_boolean(isGood) do
    case Api.Feedback.submit(%Api.Feedback{
           title: title,
           body: body,
           good?: isGood,
           game: game,
           client_id: client_id
         }) do
      :ok -> :ok
      {:error, %HTTPoison.Error{}} -> submit_feedback(client_id, payload)
    end
  end
end
