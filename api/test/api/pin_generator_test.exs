defmodule Api.PINGeneratorTest do
  use ExUnit.Case, async: true

  alias Api.PINGenerator

  setup do
    pid = start_supervised!({PINGenerator, []})
    %{pid: pid}
  end

  test "Integration test", %{pid: pid} do
    pins =
      Enum.map(1..PINGenerator.max_num_pins(), fn _ ->
        assert pin = PINGenerator.generate_pin(pid)
        assert is_binary(pin)
        pin
      end)

    assert is_nil(PINGenerator.generate_pin(pid))

    Enum.each(pins, fn pin ->
      assert :ok = PINGenerator.mark_pin_as_available(pin, pid)
      assert :error = PINGenerator.mark_pin_as_available(pin, pid)
    end)

    Enum.each(1..PINGenerator.max_num_pins(), fn _ ->
      assert pin = PINGenerator.generate_pin(pid)
      assert is_binary(pin)
      pin
    end)

    assert is_nil(PINGenerator.generate_pin(pid))
  end
end
