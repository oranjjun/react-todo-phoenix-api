defmodule TodoServerWeb.Router do
  use TodoServerWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", TodoServerWeb do
    pipe_through :api

    resources "/todos", TodoController, except: [:new, :edit]
  end
end
