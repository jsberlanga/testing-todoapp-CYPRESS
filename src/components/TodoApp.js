import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import Footer from "./Footer";

import { saveTodo, loadTodos, deleteTodo, completeTodo } from "../lib/service";
import { filterTodos } from "../lib/utils";

export default class TodoApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTodo: "",
      todos: [],
      error: null
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
  }

  componentDidMount() {
    loadTodos()
      .then(({ data }) => this.setState({ todos: data }))
      .catch(error => this.setState({ error: "Oops! Error" }));
  }

  handleInputChange(evt) {
    this.setState({ currentTodo: evt.target.value });
  }

  handleFormSubmit(evt) {
    evt.preventDefault();
    const newTodo = {
      id: this.state.todos.length + 1,
      name: this.state.currentTodo,
      isComplete: false
    };
    saveTodo(newTodo)
      .then(({ data }) =>
        this.setState({
          todos: [...this.state.todos, newTodo],
          currentTodo: ""
        })
      )
      .catch(error => this.setState({ error: true }));
  }

  handleDelete(id) {
    deleteTodo(id).then(() =>
      this.setState({ todos: this.state.todos.filter(todo => todo.id !== id) })
    );
  }

  handleComplete(todo) {
    const targetTodo = this.state.todos.find(t => todo.id === t.id);
    const updatedTodo = {
      ...targetTodo,
      isComplete: !targetTodo.isComplete
    };

    completeTodo(updatedTodo).then(({ data }) => {
      debugger;
      const todos = this.state.todos.map(t => (t.id === data.id ? data : t));
      this.setState({ todos: todos });
    });
  }

  render() {
    const remainingTodos = this.state.todos.filter(todo => !todo.isComplete)
      .length;
    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            {this.state.error && <span className="error">Oops! Error</span>}
            <TodoForm
              handleInputChange={this.handleInputChange}
              handleFormSubmit={this.handleFormSubmit}
              currentTodo={this.state.currentTodo}
            />
          </header>
          <section className="main">
            <Route
              path="/:filter?"
              render={({ match }) => (
                <TodoList
                  handleDelete={this.handleDelete}
                  handleComplete={this.handleComplete}
                  todos={filterTodos(match.params.filter, this.state.todos)}
                />
              )}
            />
          </section>
          <Footer remainingTodos={remainingTodos} />
        </div>
      </Router>
    );
  }
}
