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

      // todos.forEach(todo => {
      cy.wrap(todos).each(todo => {
        cy.focused()
          .type(todo.name)
          .type("{enter}");

        cy.wait("@create");
        cy.get(".todo-list li").should("have.length", todo.expectedLength);
      });
    });
  });

  context("with active todos", () => {
    beforeEach(() => {
      cy.fixture("todos").each(todo => {
        const newTodo = Cypress._.merge(todo, { isComplete: false });
        cy.request("POST", "/api/todos/", newTodo);
      });
      cy.visit("/");
    });

    it("load data from DB", () => {
      cy.get(".todo-list li").should("have.length", 4);
    });

    it("deletes todos", () => {
      cy.server();
      cy.route("DELETE", "/api/todos/*").as("delete");

      cy.get(".todo-list li")
        .each(el => {
          cy.wrap(el)
            .find(".destroy")
            .invoke("show")
            .click();
          cy.wait("@delete");
        })
        .should("not.exist");
    });

    it("toggles todos", () => {
      const clickAndWait = el => {
        cy.wrap(el)
          .as("item")
          .find(".toggle")
          .click();
        cy.wait("@update");
      };
      cy.server();
      cy.route("PUT", "/api/todos/*").as("update");

      cy.get(".todo-list li")
        .each(el => {
          clickAndWait(el);
          cy.get("@item").should("have.class", "completed");
        })
        .each(el => {
          clickAndWait(el);
          cy.get("@item").should("not.have.class", "completed");
        });
    });
  });
});
