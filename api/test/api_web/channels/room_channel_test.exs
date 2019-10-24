defmodule ApiWeb.RoomChannelTest do
  use ApiWeb.ChannelCase

  alias ApiWeb.RoomChannel

  @game "Shake"
  @host_name "Julius"
  @non_host_name "asd"
  @non_host2_name "zxc"

  test "Lobby returns pin" do
    Enum.each(1..10, fn _ ->
      assert {:ok, %{"pin" => pin}, socket} =
               socket(ApiWeb.UserSocket, "", %{client_id: "host"})
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
                 socket(ApiWeb.UserSocket, "", %{client_id: "host"})
                 |> join(RoomChannel, "room:#{pin}")

        assert {:error, %{reason: "Bad request"}} =
                 socket(ApiWeb.UserSocket, "", %{client_id: "host"})
                 |> join(RoomChannel, "room:#{pin}", %{"name" => @host_name})

        assert {:ok, %{}, socket} =
                 socket(ApiWeb.UserSocket, "", %{client_id: "host"})
                 |> join(RoomChannel, "room:#{pin}", %{"name" => @host_name, "game" => @game})

        # Also check that only 1 connection per client is allowed
        assert {:error, %{reason: "Existing connection"}} =
                 socket(ApiWeb.UserSocket, "", %{client_id: "host"})
                 |> join(RoomChannel, "room:#{pin}", %{"name" => @host_name, "game" => @game})

        send(tester_pid, {:host, :non_host, :connected})

        # Host should receive presence
        assert_push "presence_state", %{}
        assert_push "presence_diff", %{joins: joins, leaves: leaves}
        assert Enum.empty?(leaves)
        assert map_size(joins) == 1
        assert %{"host" => %{metas: [host_meta]}} = joins

        assert %{"isHost" => true, "isStart" => false, "game" => @game, "name" => @host_name} =
                 host_meta

        receive do
          {:non_host, :connected} -> nil
        end

        assert_push "presence_diff", %{joins: joins, leaves: leaves}
        assert Enum.empty?(leaves)
        assert map_size(joins) == 1
        assert %{"non-host" => %{metas: [non_host_meta]}} = joins
        assert %{"isHost" => false, "name" => @non_host_name} = non_host_meta

        receive do
          {:non_host2, :connected} -> nil
        end

        assert_push "presence_diff", %{joins: joins, leaves: leaves}
        assert Enum.empty?(leaves)
        assert map_size(joins) == 1
        assert %{"non-host2" => %{metas: [meta]}} = joins
        assert %{"isHost" => false, "name" => @non_host2_name} = meta

        receive do
          {:non_host, :start} -> nil
        end

        push(socket, "start", %{})
        send(tester_pid, {:host, :non_host, :start})
        send(tester_pid, {:host, :non_host2, :start})

        assert_push "presence_diff", %{
          leaves: %{"host" => %{metas: [%{"isStart" => false}]}},
          joins: %{"host" => %{metas: [%{"isStart" => true}]}}
        }

        receive do
          {:non_host, :stop} -> nil
        end

        push(socket, "stop", %{})
        send(tester_pid, {:host, :non_host, :stop})
        send(tester_pid, {:host, :non_host2, :stop})

        assert_push "presence_diff", %{
          leaves: %{"host" => %{metas: [%{"isStart" => true}]}},
          joins: %{"host" => %{metas: [%{"isStart" => false}]}}
        }

        send(tester_pid, {:host, :non_host2, :disconnect})

        receive do
          {:non_host2, :disconnected} -> nil
        end

        assert_push "presence_diff", %{leaves: leaves, joins: joins}
        assert Enum.empty?(joins)
        assert map_size(leaves) == 1
        assert %{"non-host2" => %{metas: [_meta]}} = leaves

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
                 socket(ApiWeb.UserSocket, "", %{client_id: "non-host"})
                 |> join(RoomChannel, "room:#{pin}")

        assert {:ok, %{}, socket} =
                 socket(ApiWeb.UserSocket, "", %{client_id: "non-host"})
                 |> join(RoomChannel, "room:#{pin}", %{"name" => @non_host_name})

        # Also check that only 1 connection per client is allowed
        assert {:error, %{reason: "Existing connection"}} =
                 socket(ApiWeb.UserSocket, "", %{client_id: "non-host"})
                 |> join(RoomChannel, "room:#{pin}", %{"name" => @non_host_name})

        send(tester_pid, {:non_host, :host, :connected})

        # Must get the current state, consisting of the current host
        assert_push "presence_state", state
        assert map_size(state) == 1
        assert %{"host" => %{metas: [host_meta]}} = state

        assert %{"isHost" => true, "isStart" => false, "game" => @game, "name" => @host_name} =
                 host_meta

        # And the diff, consisting of yourself
        assert_push "presence_diff", %{leaves: leaves, joins: joins}
        assert Enum.empty?(leaves)
        assert map_size(joins) == 1
        assert %{"non-host" => %{metas: [non_host_meta]}} = joins
        assert %{"isHost" => false, "name" => @non_host_name} = non_host_meta

        ref = push(socket, "start", %{})
        assert_reply ref, :error, %{reason: "Only host can perform this"}

        send(tester_pid, {:non_host, :non_host2, :connect})

        receive do
          {:non_host2, :connected} -> nil
        end

        assert_push "presence_diff", %{leaves: leaves, joins: joins}
        assert Enum.empty?(leaves)
        assert map_size(joins) == 1
        assert %{"non-host2" => %{metas: [meta]}} = joins
        assert %{"name" => @non_host2_name, "isHost" => false} = meta

        send(tester_pid, {:non_host, :host, :start})

        receive do
          {:host, :start} -> nil
        end

        assert_push "presence_diff", %{
          leaves: %{"host" => %{metas: [%{"isStart" => false}]}},
          joins: %{"host" => %{metas: [%{"isStart" => true}]}}
        }

        ref = push(socket, "stop", %{})
        assert_reply ref, :error, %{reason: "Only host can perform this"}

        send(tester_pid, {:non_host, :host, :stop})

        receive do
          {:host, :stop} -> nil
        end

        assert_push "presence_diff", %{
          leaves: %{"host" => %{metas: [%{"isStart" => true}]}},
          joins: %{"host" => %{metas: [%{"isStart" => false}]}}
        }

        receive do
          {:non_host2, :disconnected} -> nil
        end

        assert_push "presence_diff", %{leaves: leaves, joins: joins}
        assert Enum.empty?(joins)
        assert map_size(leaves) == 1
        assert %{"non-host2" => %{metas: [_meta]}} = leaves

        send(tester_pid, {:non_host, :done})
      end)

    {:ok, non_host2_pid} =
      Task.start_link(fn ->
        receive do
          {:non_host, :connect} -> nil
        end

        assert {:ok, %{}, socket} =
                 socket(ApiWeb.UserSocket, "", %{client_id: "non-host2"})
                 |> join(RoomChannel, "room:#{pin}", %{"name" => @non_host2_name})

        # Also check that only 1 connection per client is allowed
        assert {:error, %{reason: "Existing connection"}} =
                 socket(ApiWeb.UserSocket, "", %{client_id: "non-host2"})
                 |> join(RoomChannel, "room:#{pin}", %{"name" => @non_host2_name})

        send(tester_pid, {:non_host2, :non_host, :connected})
        send(tester_pid, {:non_host2, :host, :connected})

        receive do
          {:host, :start} -> nil
        end

        assert_push "presence_diff", %{
          leaves: %{"host" => %{metas: [%{"isStart" => false}]}},
          joins: %{"host" => %{metas: [%{"isStart" => true}]}}
        }

        receive do
          {:host, :stop} -> nil
        end

        assert_push "presence_diff", %{
          leaves: %{"host" => %{metas: [%{"isStart" => true}]}},
          joins: %{"host" => %{metas: [%{"isStart" => false}]}}
        }

        receive do
          {:host, :disconnect} -> nil
        end

        Process.unlink(socket.channel_pid)
        ref = leave(socket)
        assert_reply ref, :ok

        send(tester_pid, {:non_host2, :host, :disconnected})
        send(tester_pid, {:non_host2, :non_host, :disconnected})

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
end
