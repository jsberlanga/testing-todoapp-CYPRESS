// End-to-end tests
describe("Smoke tests", () => {
  beforeEach(() => {
    cy.request({
      method: "GET",
      url: "/api/todos"
    })
      .its("body")
      .each(todo =>
        cy.request({
          method: "DELETE",
          url: `/api/todos/${todo.id}`
        })
      );
  });

  context("with no initial todos", () => {
    it("create new todos", () => {
      const todos = [
        { name: "Buy milk", expectedLength: 1 },
        { name: "Buy eggs", expectedLength: 2 },
        { name: "Buy bread", expectedLength: 3 }
      ];
      cy.visit("/");
      cy.server();
      cy.route({
        method: "POST",
        url: "/api/todos"
      }).as("create");

      cy.wrap(todos).each(todo => {
        cy.focused()
          .type(todo.name)
          .type("{enter}");

        cy.wait("@create");
        cy.get(".todo-list li").should("have.length", todo.expectedLength);
      });
    });
  });
});
