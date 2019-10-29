defmodule Api.PINGeneratorTest do
  use ExUnit.Case, async: true

  alias Api.PINGenerator

  setup do
    pid = start_supervised!({PINGenerator, []})
    %{pid: pid}
  end

  test "Randomised PIN generation", %{pid: pid} do
    first_pins = Enum.map(1..10, fn _ -> PINGenerator.generate_pin(pid) end)
    Enum.each(first_pins, fn pin -> PINGenerator.mark_pin_as_available(pin, pid) end)
    second_pins = Enum.map(1..10, fn _ -> PINGenerator.generate_pin(pid) end)
    refute first_pins == second_pins
  end

  test "Integration test", %{pid: pid} do
    pins =
      Enum.map(1..PINGenerator.max_num_pins(), fn _ ->
        assert pin = PINGenerator.generate_pin(pid)
        assert is_binary(pin)
        pin
      end)

    assert is_nil(PINGenerator.generate_pin(pid))
    refute PINGenerator.has_pin?(pid)

    Enum.each(pins, fn pin ->
      assert :ok = PINGenerator.mark_pin_as_available(pin, pid)
      assert :error = PINGenerator.mark_pin_as_available(pin, pid)
      assert PINGenerator.has_pin?(pid)
    end)

    Enum.each(1..PINGenerator.max_num_pins(), fn _ ->
      assert pin = PINGenerator.generate_pin(pid)
      assert is_binary(pin)
      pin
    end)

    assert is_nil(PINGenerator.generate_pin(pid))
    refute PINGenerator.has_pin?(pid)
  end

  test "mark_pin_as_unavailable/2", %{pid: pid} do
    assert :ok = PINGenerator.mark_pin_as_unavailable("1234", pid)
    assert :error = PINGenerator.mark_pin_as_unavailable("1234", pid)
    assert :ok = PINGenerator.mark_pin_as_available("1234", pid)
    assert :error = PINGenerator.mark_pin_as_available("1234", pid)
  end

  test "Does cleanup properly" do
    assert :ok = PINGenerator.mark_pin_as_unavailable("1234")

    PINGenerator
    |> GenServer.whereis()
    |> send(:cleanup)

    # Make a GenServer call just to make sure that the process message has been processed
    assert PINGenerator.has_pin?()
    assert :ok = PINGenerator.mark_pin_as_unavailable("1234")
  end
end
