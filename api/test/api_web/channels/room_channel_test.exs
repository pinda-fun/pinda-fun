defmodule ApiWeb.RoomChannelTest do
  use ApiWeb.ChannelCase

  test "room:lobby returns PIN" do
    assert {:ok, %{"pin" => pin}, socket} =
             socket(ApiWeb.UserSocket, "user_id", %{some: :assign})
             |> subscribe_and_join(ApiWeb.RoomChannel, "room:lobby")
  end
end
