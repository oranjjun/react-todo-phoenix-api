defmodule TodoServer.Repo.Migrations.CreateTodos do
  use Ecto.Migration

  def change do
    create table(:todos) do
      add :text, :string

      timestamps()
    end

  end
end
