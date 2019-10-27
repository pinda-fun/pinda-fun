defmodule ApiWeb.RoomChannelTest do
  use ApiWeb.ChannelCase

  alias ApiWeb.RoomChannel

  @game "Shake"

  @host_client_id "host"
  @host_name "Julius"
  @default_host_meta %{
    "isHost" => true,
    "isStart" => false,
    "game" => @game,
    "name" => @host_name
  }

  @non_host_client_id "non-host"
  @non_host_name "asd"

  @non_host2_client_id "non-host2"
  @non_host2_name "zxc"

  test "Lobby returns pin" do
    Enum.each(1..10, fn _ ->
      assert {:ok, %{"pin" => pin}, socket} =
               socket(ApiWeb.UserSocket, "", %{client_id: @host_client_id})
               |> subscribe_and_join(RoomChannel, "room:lobby")

      assert :error = Api.PINGenerator.mark_pin_as_unavailable(pin)
    end)
  end

  # Order of things:
  # - host connected
  # - host checks its presence
  # - non-host connected
  # - host and non-host check their presences
  # - non-host tries to issue hostcommand and fails
  # - non-host2 connected
  # - host, non-host and non-host2 all check their presences
  # - host issues hostcommands and succeeds
  # - host, non-host and non-host2 all checks their presences
  # - non-host2 leaves
  # - host, non-host check their presences
  test "Integration test" do
    pin = "5678"
    tester_pid = self()

    {:ok, host_pid} =
      Task.start_link(fn ->
        # Connect host
        # As host, must provide both name and game, bad request otherwise
        assert {:error, %{reason: "Bad request"}} =
                 socket(ApiWeb.UserSocket, "", %{client_id: @host_client_id})
                 |> join(RoomChannel, "room:#{pin}")

        assert {:error, %{reason: "Bad request"}} =
                 socket(ApiWeb.UserSocket, "", %{client_id: @host_client_id})
                 |> join(RoomChannel, "room:#{pin}", %{"name" => @host_name})

        assert {:ok, %{}, socket} =
                 socket(ApiWeb.UserSocket, "", %{client_id: @host_client_id})
                 |> join(RoomChannel, "room:#{pin}", %{"name" => @host_name, "game" => @game})

        # Also check that only 1 connection per client is allowed
        assert {:error, %{reason: "Existing connection"}} =
                 socket(ApiWeb.UserSocket, "", %{client_id: @host_client_id})
                 |> join(RoomChannel, "room:#{pin}", %{"name" => @host_name, "game" => @game})

        send(tester_pid, {:host, :non_host, :connected})

        # Host should receive presence
        assert_push "presence_state", %{}
        assert_join(@host_client_id, @default_host_meta)

        receive do
          {:non_host, :connected} -> nil
        end

        assert_join(@non_host_client_id, %{"isHost" => false, "name" => @non_host_name})

        receive do
          {:non_host2, :connected} -> nil
        end

        assert_join(@non_host2_client_id, %{"isHost" => false, "name" => @non_host2_name})

        receive do
          {:non_host, :start} -> nil
        end

        push(socket, "start", %{})
        send(tester_pid, {:host, :non_host, :start})
        send(tester_pid, {:host, :non_host2, :start})

        assert_host_change(%{"isStart" => false}, %{"isStart" => true})

        receive do
          {:non_host, :stop} -> nil
        end

        push(socket, "stop", %{})
        send(tester_pid, {:host, :non_host, :stop})
        send(tester_pid, {:host, :non_host2, :stop})

        assert_host_change(%{"isStart" => true}, %{"isStart" => false})

        send(tester_pid, {:host, :non_host2, :disconnect})

        receive do
          {:non_host2, :disconnected} -> nil
        end

        assert_leave(@non_host2_client_id)

        # Ensure mailbox is empty
        refute_receive %Phoenix.Socket.Reply{}
        refute_receive %Phoenix.Socket.Message{}
        send(tester_pid, {:host, :done})
      end)

    {:ok, non_host_pid} =
      Task.start_link(fn ->
        receive do
          {:host, :connected} -> nil
        end

        # Now that the host is connected, try to connect as a non-host, who must provide name
        # Bad request otherwise
        assert {:error, %{reason: "Bad request"}} =
                 socket(ApiWeb.UserSocket, "", %{client_id: @non_host_client_id})
                 |> join(RoomChannel, "room:#{pin}")

        assert {:ok, %{}, socket} =
                 socket(ApiWeb.UserSocket, "", %{client_id: @non_host_client_id})
                 |> join(RoomChannel, "room:#{pin}", %{"name" => @non_host_name})

        # Also check that only 1 connection per client is allowed
        assert {:error, %{reason: "Existing connection"}} =
                 socket(ApiWeb.UserSocket, "", %{client_id: @non_host_client_id})
                 |> join(RoomChannel, "room:#{pin}", %{"name" => @non_host_name})

        send(tester_pid, {:non_host, :host, :connected})

        # Must get the current state, consisting of the current host
        assert_push "presence_state", state
        assert map_size(state) == 1
        assert %{@host_client_id => %{metas: [@default_host_meta]}} = state

        # And the diff, consisting of yourself
        assert_join(@non_host_client_id, %{"isHost" => false, "name" => @non_host_name})

        ref = push(socket, "start", %{})
        assert_reply ref, :error, %{reason: "Only host can perform this"}

        send(tester_pid, {:non_host, :non_host2, :connect})

        receive do
          {:non_host2, :connected} -> nil
        end

        assert_join(@non_host2_client_id, %{"isHost" => false, "name" => @non_host2_name})

        send(tester_pid, {:non_host, :host, :start})

        receive do
          {:host, :start} -> nil
        end

        assert_host_change(%{"isStart" => false}, %{"isStart" => true})

        ref = push(socket, "stop", %{})
        assert_reply ref, :error, %{reason: "Only host can perform this"}

        send(tester_pid, {:non_host, :host, :stop})

        receive do
          {:host, :stop} -> nil
        end

        assert_host_change(%{"isStart" => true}, %{"isStart" => false})

        receive do
          {:non_host2, :disconnected} -> nil
        end

        assert_leave(@non_host2_client_id)

        # Ensure mailbox is empty
        refute_receive %Phoenix.Socket.Reply{}
        refute_receive %Phoenix.Socket.Message{}
        send(tester_pid, {:non_host, :done})
      end)

    {:ok, non_host2_pid} =
      Task.start_link(fn ->
        receive do
          {:non_host, :connect} -> nil
        end

        assert {:ok, %{}, socket} =
                 socket(ApiWeb.UserSocket, "", %{client_id: @non_host2_client_id})
                 |> join(RoomChannel, "room:#{pin}", %{"name" => @non_host2_name})

        # Also check that only 1 connection per client is allowed
        assert {:error, %{reason: "Existing connection"}} =
                 socket(ApiWeb.UserSocket, "", %{client_id: @non_host2_client_id})
                 |> join(RoomChannel, "room:#{pin}", %{"name" => @non_host2_name})

        send(tester_pid, {:non_host2, :non_host, :connected})
        send(tester_pid, {:non_host2, :host, :connected})

        assert_push "presence_state", state
        assert map_size(state) == 2
        assert %{metas: [@default_host_meta]} = state[@host_client_id]

        assert %{metas: [%{"isHost" => false, "name" => @non_host_name}]} =
                 state[@non_host_client_id]

        assert_join(@non_host2_client_id, %{"isHost" => false, "name" => @non_host2_name})

        receive do
          {:host, :start} -> nil
        end

        assert_host_change(%{"isStart" => false}, %{"isStart" => true})

        receive do
          {:host, :stop} -> nil
        end

        assert_host_change(%{"isStart" => true}, %{"isStart" => false})

        receive do
          {:host, :disconnect} -> nil
        end

        Process.unlink(socket.channel_pid)
        close(socket)

        # Ignore any potential racey message
        receive do
          %Phoenix.Socket.Message{
            event: "presence_diff",
            payload: %{leaves: %{@non_host2_client_id => _}}
          } ->
            nil
        after
          100 -> nil
        end

        send(tester_pid, {:non_host2, :host, :disconnected})
        send(tester_pid, {:non_host2, :non_host, :disconnected})

        # Ensure mailbox is empty
        refute_receive %Phoenix.Socket.Reply{}
        refute_receive %Phoenix.Socket.Message{}
        send(tester_pid, {:non_host2, :done})
      end)

    receive_loop(%{host: host_pid, non_host: non_host_pid, non_host2: non_host2_pid})
  end

  defp receive_loop(mapping, done_set \\ MapSet.new()) when is_map(mapping) do
    if MapSet.size(done_set) == length(Map.keys(mapping)) do
      nil
    else
      receive do
        {sender, :done} ->
          receive_loop(mapping, MapSet.put(done_set, sender))

        {sender, receiver, msg} ->
          send(mapping[receiver], {sender, msg})
          receive_loop(mapping, done_set)
      end
    end
  end

  defp assert_join(client_id, expected_meta) do
    assert_push "presence_diff", %{joins: joins, leaves: leaves}
    assert Enum.empty?(leaves)
    assert map_size(joins) == 1
    assert %{metas: [meta]} = joins[client_id]
    assert Enum.all?(expected_meta, fn {k, v} -> meta[k] == v end)
  end

  defp assert_leave(client_id) do
    assert_push "presence_diff", %{joins: joins, leaves: leaves}
    assert Enum.empty?(joins)
    assert map_size(leaves) == 1
    assert %{metas: [_meta]} = leaves[client_id]
  end

  def assert_host_change(old_meta, new_meta) do
    assert_push "presence_diff", %{joins: joins, leaves: leaves}
    assert map_size(joins) == 1
    assert map_size(leaves) == 1
    assert %{metas: [leave_meta]} = leaves[@host_client_id]
    assert %{metas: [join_meta]} = joins[@host_client_id]
    assert Enum.all?(old_meta, fn {k, v} -> leave_meta[k] == v end)
    assert Enum.all?(new_meta, fn {k, v} -> join_meta[k] == v end)
  end
end
