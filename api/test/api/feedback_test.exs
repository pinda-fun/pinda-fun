defmodule Api.FeedbackTest do
  use ExUnit.Case, async: false

  import Mock

  @feedback_impl Application.get_env(:api, Api.Feedback)
  @feedback_impl_module Module.safe_concat(Api.Feedback, @feedback_impl)

  @title "Very cute"
  @body "I like"
  @client_id "dada"
  @game "shake"

  describe "submit/1" do
    test "happy path" do
      with_mock @feedback_impl_module, submit: fn _ -> :ok end do
        assert :ok =
                 Api.Feedback.submit(%Api.Feedback{
                   title: @title,
                   body: @body,
                   good?: true,
                   client_id: @client_id,
                   game: @game
                 })
      end
    end
  end
end
