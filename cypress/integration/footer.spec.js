describe("Footer", () => {
  context("with a single todo", () => {
    it("displays single todo", () => {
      cy.seedAndVisit([{ id: 1, name: "Buy cookies", isComplete: false }]);
      cy.get(".todo-count").should("contain", "1 todo left");
    });
  });

  context("with multiple todos", () => {
    beforeEach(() => {
      cy.seedAndVisit();
    });
    it("displays multiple todos", () => {
      cy.get(".todo-count").should("contain", "3 todos left");
    });

    it("filters todos", () => {
      const filters = [
        { link: "Active", expectedLength: 3 },
        { link: "Completed", expectedLength: 1 },
        { link: "All", expectedLength: 4 }
      ];

      filters.forEach(filter => {
        cy.contains(filter.link).click();
        cy.get(".todo-list li").should("have.length", filter.expectedLength);
      });
    });
  });
});
