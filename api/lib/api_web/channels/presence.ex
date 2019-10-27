defmodule ApiWeb.Presence do
  @moduledoc """
  Provides presence tracking to channels and processes.

  See the [`Phoenix.Presence`](http://hexdocs.pm/phoenix/Phoenix.Presence.html)
  docs for more details.

  ## Usage

  Presences can be tracked in your channel after joining:

      defmodule Api.MyChannel do
        use ApiWeb, :channel
        alias ApiWeb.Presence

        def join("some:topic", _params, socket) do
          send(self(), :after_join)
          {:ok, assign(socket, :user_id, ...)}
        end

        def handle_info(:after_join, socket) do
          push(socket, "presence_state", Presence.list(socket))
          {:ok, _} = Presence.track(socket, socket.assigns.user_id, %{
            online_at: inspect(System.system_time(:second))
          })
          {:noreply, socket}
        end
      end

  In the example above, `Presence.track` is used to register this
  channel's process as a presence for the socket's user ID, with
  a map of metadata. Next, the current presence list for
  the socket's topic is pushed to the client as a `"presence_state"` event.

  Finally, a diff of presence join and leave events will be sent to the
  client as they happen in real-time with the "presence_diff" event.
  See `Phoenix.Presence.list/2` for details on the presence data structure.

  ## Fetching Presence Information

  The `fetch/2` callback is triggered when using `list/1`
  and serves as a mechanism to fetch presence information a single time,
  before broadcasting the information to all channel subscribers.
  This prevents N query problems and gives you a single place to group
  isolated data fetching to extend presence metadata.

  The function receives a topic and map of presences and must return a
  map of data matching the Presence data structure:

      %{"123" => %{metas: [%{status: "away", phx_ref: ...}],
        "456" => %{metas: [%{status: "online", phx_ref: ...}]}

  The `:metas` key must be kept, but you can extend the map of information
  to include any additional information. For example:

      def fetch(_topic, entries) do
        users = entries |> Map.keys() |> Accounts.get_users_map(entries)
        # => %{"123" => %{name: "User 123"}, "456" => %{name: nil}}

        for {key, %{metas: metas}} <- entries, into: %{} do
          {key, %{metas: metas, user: users[key]}}
        end
      end

  The function above fetches all users from the database who
  have registered presences for the given topic. The fetched
  information is then extended with a `:user` key of the user's
  information, while maintaining the required `:metas` field from the
  original presence data.
  """
  use Phoenix.Presence,
    otp_app: :api,
    pubsub_server: Api.PubSub

  require Logger

  @doc """
  Catches exit due to GenServer.call/2 timeout.

  Note that the client still need to handle and ignore the GenServer callback
  (two-element tuples with a reference as the first element)
  """
  @spec safe_list(Phoenix.Socket.t() | String.t()) ::
          {:ok, Phoenix.Presence.presences()} | {:error, :timeout}
  def safe_list(socket_or_topic) do
    try do
      {:ok, __MODULE__.list(socket_or_topic)}
    catch
      :exit, _ ->
        Logger.warn("#{__MODULE__}: safe_list/1 timed out.")
        {:error, :timeout}
    end
  end

  @spec safe_update(Phoenix.Socket.t(), String.t(), map() | (map() -> map())) ::
          {:ok, ref :: binary()} | {:error, :timeout | term()}
  def safe_update(socket, key, meta) do
    try do
      __MODULE__.update(socket, key, meta)
    catch
      :exit, _ ->
        Logger.warn("#{__MODULE__}: safe_update/3 timed out.")
        {:error, :timeout}
    end
  end

  defp base_meta(type, %{"name" => name}) when is_binary(name) do
    %{
      "isHost" => type == :host,
      "name" => name,
      "result" => []
    }
  end

  def meta(type = :host, payload = %{"game" => game}) when is_binary(game) do
    base_meta(type, payload)
    |> Map.put("game", game)
    |> Map.put("state", 0)
  end

  def meta(type = :non_host, payload) do
    base_meta(type, payload)
  end
end
