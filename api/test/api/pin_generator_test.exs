defmodule Api.PINGeneratorTest do
  use ExUnit.Case, async: true

  alias Api.PINGenerator

  test "Integration test" do
    pins = Enum.map(1..5, fn _ -> PINGenerator.generate_pin() end)

    Enum.each(pins, fn pin ->
      assert is_binary(pin)
      assert :ok = PINGenerator.mark_pin_as_available(pin)
      assert :error = PINGenerator.mark_pin_as_available(pin)
    end)
  end
end
