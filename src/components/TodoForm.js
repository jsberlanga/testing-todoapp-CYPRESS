import React from "react";

export default props => (
  <form onSubmit={props.handleFormSubmit}>
    <input
      type="text"
      className="new-todo"
      value={props.currentTodo}
      onChange={e => props.handleInputChange(e)}
      placeholder="What needs to be done?"
    />
  </form>
);
