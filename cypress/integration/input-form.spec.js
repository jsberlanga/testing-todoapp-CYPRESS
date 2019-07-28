describe("input form", () => {
  beforeEach(() => {
    cy.seedAndVisit([]);
  });
  it("accepts input", () => {
    const typedText = "this would be a new todo";
    cy.get(".new-todo")
      .type(typedText)
      .should("have.value", typedText);
  });

  it("complete route works", () => {
    cy.contains("Completed").click();
    cy.url().should("include", "/completed");
  });

  // context like describe helps us to organize our tests
  context("Form submission", () => {
    beforeEach(() => {
      cy.server();
    });
    it("Adds a new todo on submit", () => {
      const typedText = "buy ice-cream";
      cy.route({
        method: "POST",
        url: "/api/todos",
        status: 200,
        response: {
          id: 1,
          name: typedText,
          isComplete: false
        }
      });

      cy.get(".new-todo")
        .type(typedText)
        .type("{enter}")
        .should("have.value", "");

      cy.get(".todo-list li")
        .should("have.length", 1)
        .and("contain", typedText);
    });

    it("Shows an error message on failed submission", () => {
      cy.route({
        url: "/api/todos",
        method: "POST",
        status: 500,
        response: {}
      });

      cy.get(".new-todo").type("{enter}");
      cy.get(".todo-list li").should("not.exist");
      cy.get(".error").should("be.visible");
    });
  });
});
