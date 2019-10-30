defmodule Api.FeedbackTest do
  use ExUnit.Case, async: false

  import Mock

  @title "Very cute"
  @body "I like"

  describe "submit/1" do
    test "happy path" do
      post = fn _, _, _ -> {:ok, %HTTPoison.Response{status_code: 201}} end

      with_mock HTTPoison, post: post do
        assert :ok = Api.Feedback.submit(%Api.Feedback{title: @title, body: @body, good?: true})
      end
    end
  end
end
