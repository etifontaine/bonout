describe("events", () => {
  it("should get json", () => {
    cy.request("http://localhost:3000/api/events").then(
      response => {
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.be.greaterThan(0);
      }
    );
  });
});
