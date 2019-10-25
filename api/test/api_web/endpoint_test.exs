defmodule ApiWeb.EndpointTest do
  use ExUnit.Case, async: true

  alias ApiWeb.Endpoint

  describe "origin_ok?/1" do
    test "Allows pinda.fun and its subdomains" do
      assert origin_ok?("https://pinda.fun")

      Enum.each(1..10, fn _ -> origin_ok?("https://#{Faker.Internet.domain_word()}.pinda.fun") end)
    end

    test "Allows Netlify deploy previews" do
      Enum.each(1..10, fn _ ->
        assert origin_ok?(
                 "https://deploy-preview-#{Enum.random(1..1_000_000)}--pinda-fun.netlify.com/"
               )
      end)
    end

    defp origin_ok?(url) when is_binary(url) do
      url
      |> URI.parse()
      |> Endpoint.origin_ok?()
    end
  end
end
