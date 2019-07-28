describe("List items", () => {
  beforeEach(() => {
    cy.seedAndVisit();
  });
  it("displays completed items", () => {
    cy.get(".todo-list li")
      .filter(".completed")
      .should("have.length", 1)
      .and("contain", "Eggs")
      .find(".toggle")
      .should("be.checked");
    it("displays remaining todos in footer", () => {
      cy.get(".todo-count").should("contain", 3);
    });
  });

  it.only("removes a todo", () => {
    cy.route({
      url: "/api/todos/1",
      method: "DELETE",
      status: 200,
      response: {}
    });
    cy.get(".todo-list li").as("list");

    cy.get("@list")
      .first()
      //.eq(0) // same as first()
      .find(".destroy")
      // we invoke show because the button is hidden and it
      // appears on mouse hover
      .invoke("show")
      .click();

    cy.get("@list")
      .should("have.length", 3)
      .and("not.contain", "Milk");
  });

  it.only("Marks an incomplete item complete", () => {
    cy.fixture("todos").then(todos => {
      const target = Cypress._.head(todos);
      cy.route(
        "PUT",
        `/api/todos/${target.id}`,
        Cypress._.merge(target, { isComplete: true })
      );
    });
    cy.get(".todo-list li")
      .first()
      .as("first-todo");

    cy.get("@first-todo")
      .find(".toggle")
      .click()
      .should("be.checked");

    cy.get("@first-todo").should("have.class", "completed");

    cy.get(".todo-count").should("contain", 2);
  });
});
