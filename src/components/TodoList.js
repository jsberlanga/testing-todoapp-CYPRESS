import React from "react";

const TodoItem = props => (
  <li className={props.todo.isComplete ? "completed" : null}>
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        onChange={() => props.handleComplete(props.todo)}
        checked={props.todo.isComplete}
      />
      <label>{props.todo.name}</label>
      <button
        className="destroy"
        onClick={() => props.handleDelete(props.todo.id)}
      />
    </div>
  </li>
);

export default props => (
  <ul className="todo-list">
    {props.todos.map(todo => (
      <TodoItem
        handleComplete={props.handleComplete}
        handleDelete={props.handleDelete}
        key={todo.id}
        todo={todo}
      />
    ))}
  </ul>
);
