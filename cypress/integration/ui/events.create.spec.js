describe("CreateEvent", () => {
  // it("should be valid if name input > 4", () => {
  //   cy.visit("http://localhost:3000/events/create");
  //   cy.get("#name").type("test");
  //   cy.get("name").should(
  //     "have.class",
  //     ".focus:border-red-500.border-red-500"
  //   );
  //   cy.get("#name").type("testtest");
  //   cy.get("#name").should(
  //     "not.have.class",
  //     "border-red-500"
  //   );
  // });
  // it("should be valid if description input > 4", () => {
  //   cy.visit("http://localhost:3000/events/create");
  //   cy.get("#description").type("test");
  //   cy.get("#description").should(
  //     "have.class",
  //     "is-invalid"
  //   );
  //   cy.get("#description").type("testtest");
  //   cy.get("#description").should("have.class", "is-valid");
  // });
  // it("should be valid if date > now", () => {
  //   cy.visit("/events/create");
  //   cy.get("#date").type("2020-01-01");
  //   cy.get("#date").should("have.class", "is-invalid");
  //   const tomorrow = new Date();
  //   tomorrow.setDate(tomorrow.getDate() + 1);
  //   cy.get("#date").type(tomorrow.toLocaleDateString());
  //   cy.get("#date").should("have.class", "is-valid");
  // });
  // it("should be empty after submit", () => {
  //   cy.visit("/events/create");
  //   cy.get("#name").type("test");
  //   cy.get("#description").type("test");
  //   cy.get("#date").type("2020-01-01");
  //   cy.get("#create-event-button").click();
  //   cy.get("#name").should("have.value", "");
  //   cy.get("#description").should("have.value", "");
  //   cy.get("#date").should("have.value", "");
  // })
  // it("should after sublit create an event", () => {
  //   cy.visit("http://localhost:3000/events/create");
  //   cy.get("#name").type("Etienne");
  //   cy.get("#date").type("2021-11-30");
  //   cy.get("#location").type("Criel sur mer");
  //   cy.get("#description").type("trololol");
  //   cy.get("[type=submit]").click();
  // });
});
