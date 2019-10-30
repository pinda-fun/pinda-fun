defmodule Api.Feedback.GitHubTest do
  use ExUnit.Case, async: false

  import Mock

  @repo "test/example"
  @username "john-smith"
  @token "DEADBEEF"

  @title "Very cute"
  @body "I like"

  describe "submit/1" do
    test "happy path" do
      post = fn "https://api.github.com/repos/#{@repo}/issues", issue_json, headers ->
        assert %{"title" => @title, "body" => body, "labels" => ["good"]} =
                 Jason.decode!(issue_json)

        content_type = find_header(headers, "content-type")

        assert String.downcase(content_type) == "application/json"

        [_, credentials] = headers |> find_header("authorization") |> String.split(" ")

        [username, token] = credentials |> Base.decode64!() |> String.split(":")

        assert username == @username
        assert token == @token

        {:ok, %HTTPoison.Response{status_code: 201}}
      end

      with_mock HTTPoison, post: post do
        assert :ok =
                 Api.Feedback.GitHub.submit(%Api.Feedback{title: @title, body: @body, good?: true})
      end
    end
  end

  defp find_header(headers, key) when is_list(headers) do
    {_, v} = Enum.find(headers, fn {k, _v} -> String.downcase(k) == String.downcase(key) end)
    v
  end
end
