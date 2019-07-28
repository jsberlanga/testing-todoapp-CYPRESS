describe("App Initialization", () => {
  it("renders initial todos", () => {
    cy.seedAndVisit();
    cy.get(".todo-list li").should("have.length", 4);
  });
  it("displays error on failure", () => {
    cy.server();
    cy.route({
      url: "/api/todos",
      method: "GET",
      response: {},
      status: 500
    });

    cy.visit("/");
    cy.get(".todo-list li").should("have.length", 0);
    cy.get(".error").should("be.visible");
  });
});
