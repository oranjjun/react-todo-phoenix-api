import React from "react";
import axios from "axios";
import { Socket } from "phoenix";

const Title = ({ todoCount }) => (
  <div>
    <div>
      <h1>to-do ({todoCount})</h1>
    </div>
  </div>
);

const TodoForm = ({ addTodo }) => {
  let input;

  return (
    <form
      onSubmit={e => {
        e.preventDefault();

        if (input.value.trim() !== "") {
          addTodo(input.value);
          input.value = "";
        }
      }}
    >
      <input
        className="form-control col-md-12"
        ref={node => {
          input = node;
        }}
      />
      <br />
    </form>
  );
};

const Todo = ({ todo, remove }) => (
  <a
    href="#"
    className="list-group-item"
    onClick={() => {
      remove(todo.id);
    }}
  >
    {todo.text}
  </a>
);

const TodoList = ({ todos, remove }) => {
  const todoNode = todos.map(todo => (
    <Todo todo={todo} key={todo.id} remove={remove} />
  ));
  return (
    <div className="list-group" style={{ marginTop: "30px" }}>
      {todoNode}
    </div>
  );
};

// Contaner Component
export default class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };

    const { REACT_APP_API_URL, REACT_APP_WS_URL } = process.env;
    this.apiUrl = REACT_APP_API_URL;
    let socket = new Socket(REACT_APP_WS_URL, {
      params: { token: window.userToken }
    });
    socket.connect();
    this.channel = socket.channel("room:lobby", {});
  }

  componentDidMount() {
    axios.get(this.apiUrl).then(res => {
      this.setState({ data: res.data.data });
    });

    this.channel
      .join()
      .receive("ok", response => {
        console.log("Joined successfully", response);
      })
      .receive("error", response => {
        console.log("Unable to join", response);
      });

    this.channel.on("new_msg", payload => {
      console.log("New todo from socket", payload);
      this.setState({ data: [...this.state.data, payload.body] });
    });

    this.channel.on("del_msg", payload => {
      console.log("Deleted todo from socket", payload);
      this.setState({
        data: this.state.data.filter(item => item.id !== payload.body)
      });
    });
  }

  handleAdd(val) {
    const todo = {
      todo: {
        text: val
      }
    };

    axios.post(this.apiUrl, todo).then(res => {
      console.log('handleAdd res', res)
      this.channel.push("new_msg", { body: res.data.data });
    });
  }

  handleRemove(id) {
    axios.delete(`${this.apiUrl}/${id}`).then(res => {
      console.log("Removed! res: ", res);
      this.channel.push("del_msg", { body: id });
    });
  }

  render() {
    return (
      <div>
        <Title todoCount={this.state.data.length} />
        <TodoForm addTodo={this.handleAdd.bind(this)} />
        <TodoList
          todos={this.state.data}
          remove={this.handleRemove.bind(this)}
        />
      </div>
    );
  }
}
