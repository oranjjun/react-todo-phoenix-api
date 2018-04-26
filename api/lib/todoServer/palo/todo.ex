defmodule TodoServer.Palo.Todo do
  use Ecto.Schema
  import Ecto.Changeset
  alias TodoServer.Palo.Todo

  schema "todos" do
    field :text, :string

    timestamps()
  end

  @doc false
  def changeset(%Todo{} = todo, attrs) do
    todo
    |> cast(attrs, [:text])
    |> validate_required([:text])
  end
end
