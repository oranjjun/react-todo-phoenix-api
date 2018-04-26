import React from "react";
import axios from "axios";

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

    const { REACT_APP_API_URL } = process.env;

    this.apiUrl = REACT_APP_API_URL;
  }

  componentDidMount() {
    axios.get(this.apiUrl).then(res => {
      this.setState({ data: res.data.data });
    });
  }

  handleAdd(val) {
    const todo = {
      todo: {
        text: val
      }
    };

    axios.post(this.apiUrl, todo).then(res => {
      this.setState({
        data: [...this.state.data, res.data.data]
      });
    });
  }

  handleRemove(id) {
    axios.delete(`${this.apiUrl}/${id}`).then(res => {
      this.setState({
        data: this.state.data.filter(todo => todo.id !== id)
      });
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
