defmodule Api.Feedback.GitHub do
  @config Application.get_env(:api, :github)
  @repo Keyword.get(@config, :repo)
  @username Keyword.get(@config, :username)
  @token Keyword.get(@config, :token)

  @behaviour Api.Feedback

  @impl true
  def submit(%Api.Feedback{title: title, body: body, good?: good?})
      when is_binary(title) and is_binary(body) and is_boolean(good?) do
    headers = [{"Content-Type", "application/json"}, {"Authorization", authorization()}]

    labels = if good?, do: ["good"], else: ["bad"]
    issue = %{title: title, body: body, labels: labels}

    with {:ok, issue_json} <- Jason.encode(issue),
         {:ok, %HTTPoison.Response{status_code: 201}} <-
           HTTPoison.post("https://api.github.com/repos/#{@repo}/issues", issue_json, headers) do
      :ok
    else
      {:error, error} -> {:error, error}
    end
  end

  defp authorization do
    credentials = Base.encode64("#{@username}:#{@token}")
    "Basic #{credentials}"
  end
end
