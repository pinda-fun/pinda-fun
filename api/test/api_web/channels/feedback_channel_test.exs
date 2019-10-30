defmodule ApiWeb.FeedbackChannelTest do
  use ApiWeb.ChannelCase

  alias ApiWeb.FeedbackChannel

  import Mock

  @client_id "dada"
  @game "shake"
  @title "Very cute"
  @body "I like"

  test "joining with wrong client_id fails" do
    assert {:error, %{reason: "Bad request"}} =
             socket(ApiWeb.UserSocket, "", %{client_id: @client_id})
             |> join(FeedbackChannel, "feedback: #{@client_id <> @client_id}")
  end

  test "Integration test: happy path" do
    with_mock Api.Feedback, submit: fn _ -> :ok end do
      assert {:ok, %{}, socket} =
               socket(ApiWeb.UserSocket, "", %{client_id: @client_id})
               |> join(FeedbackChannel, "feedback:#{@client_id}")

      # Bad request
      ref = push(socket, "submitResult", %{})
      assert_reply ref, :error, %{reason: "Bad request"}

      ref =
        push(socket, "submitResult", %{
          "game" => @game,
          "title" => @title,
          "body" => @body,
          "isGood" => true
        })

      assert_reply ref, :ok

      assert_called(
        Api.Feedback.submit(%Api.Feedback{
          title: @title,
          game: @game,
          good?: true,
          body: @body,
          client_id: @client_id
        })
      )
    end
  end

  test "retry on error" do
    {:ok, counter} = Agent.start_link(fn -> 0 end)

    submit = fn _ ->
      Agent.update(counter, &(&1 + 1))

      case Agent.get(counter, & &1) do
        n when n > 2 -> :ok
        _ -> {:error, %HTTPoison.Error{}}
      end
    end

    with_mock Api.Feedback, submit: submit do
      assert {:ok, %{}, socket} =
               socket(ApiWeb.UserSocket, "", %{client_id: @client_id})
               |> join(FeedbackChannel, "feedback:#{@client_id}")

      ref =
        push(socket, "submitResult", %{
          "game" => @game,
          "title" => @title,
          "body" => @body,
          "isGood" => true
        })

      assert_reply ref, :ok

      wait_until_retry(counter)
    end
  end

  defp wait_until_retry(counter, timeout \\ 5_000) do
    Process.send_after(self(), :timeout, timeout)
    do_wait_until_retry(counter)
  end

  defp do_wait_until_retry(counter) do
    receive do
      :timeout -> raise "Seems like the request is never retried"
    after
      0 -> nil
    end

    case Agent.get(counter, & &1) do
      n when n > 2 -> :ok
      _ -> wait_until_retry(counter)
    end
  end
end
