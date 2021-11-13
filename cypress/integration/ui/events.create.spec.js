describe("CreateEvent", () => {
  it("should after sublit create an event", () => {
    cy.visit("http://localhost:3000/events/add");
    cy.get("#name").type("Etienne");
    cy.get("#date").type("2021-11-30");
    cy.get("#location").type("Criel sur mer");
    cy.get("#description").type("trololol");
    cy.get("[type=submit]").click();
  });
});
