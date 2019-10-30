defmodule Api.Feedback do
  @feedback_impl Application.get_env(:api, __MODULE__)
  @feedback_impl_module Module.safe_concat(__MODULE__, @feedback_impl)

  @enforce_keys ~w(title good?)a
  defstruct title: nil, good?: nil, body: ""

  @type t :: %__MODULE__{title: String.t(), good?: boolean(), body: String.t()}

  @callback submit(__MODULE__.t()) :: :ok | {:error, any()}
  defdelegate submit(feedback), to: @feedback_impl_module
end
