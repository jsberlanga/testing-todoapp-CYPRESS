import todos from "../fixtures/todos.json";

Cypress.Commands.add("seedAndVisit", (seedData = todos) => {
  cy.server();
  cy.route({
    url: "/api/todos",
    method: "GET",
    response: seedData,
    // it can also be referenced like this, without import
    // response: "fixture:todos",
    status: 200
  });

  // it is important to visit the page after the route is setup
  // otherwise the page will render first and then make a request
  // before the route is in place
  cy.visit("/");
});
