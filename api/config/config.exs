# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :todoServer,
  ecto_repos: [TodoServer.Repo]

# Configures the endpoint
config :todoServer, TodoServerWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "e25WKaPLY/0Dnf3c5Q0JFuujGQw//BqLvTQjuUkV3aKjz+9UICdcC2vAcwPse0f3",
  render_errors: [view: TodoServerWeb.ErrorView, accepts: ~w(json)],
  pubsub: [name: TodoServer.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
