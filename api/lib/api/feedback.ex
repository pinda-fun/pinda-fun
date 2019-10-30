defmodule Api.Feedback do
  @moduledoc """
  Specifies the struct for feedback in user testing and the behaviour for a module that submits
  the feedback.
  """

  @feedback_impl Application.get_env(:api, __MODULE__)
  @feedback_impl_module Module.safe_concat(__MODULE__, @feedback_impl)

  @enforce_keys ~w(title good? client_id game)a
  defstruct title: nil, good?: nil, client_id: nil, game: nil, body: ""

  @type t :: %__MODULE__{
          title: String.t(),
          good?: boolean(),
          client_id: String.t(),
          game: String.t(),
          body: String.t()
        }

  @callback submit(__MODULE__.t()) :: :ok | {:error, any()}
  defdelegate submit(feedback), to: @feedback_impl_module
end
