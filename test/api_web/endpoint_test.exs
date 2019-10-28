defmodule ApiWeb.EndpointTest do
  use ExUnit.Case, async: true

  alias ApiWeb.Endpoint

  describe "origin_ok?/1" do
    test "Accepts pinda.fun and its subdomains" do
      assert_accept("https://pinda.fun")
      assert_accept("http://pinda.fun")
      assert_accept("https://www.pinda.fun")
      assert_accept("http://www.pinda.fun")

      Enum.each(1..10, fn _ ->
        assert_accept("http://#{Faker.Internet.domain_word()}.pinda.fun")
        assert_accept("https://#{Faker.Internet.domain_word()}.pinda.fun")

        assert_accept(
          "http://#{Faker.Internet.domain_word()}.#{Faker.Internet.domain_word()}.pinda.fun"
        )

        assert_accept(
          "https://#{Faker.Internet.domain_word()}.#{Faker.Internet.domain_word()}.pinda.fun"
        )
      end)
    end

    test "Accepts Netlify deploy preview" do
      Enum.each(1..1_000, fn i ->
        assert_accept("https://deploy-preview-#{i}--pinda-fun.netlify.com/")
      end)
    end

    defp assert_accept(uri) do
      uri
      |> URI.parse()
      |> Endpoint.origin_ok?()
    end
  end
end
