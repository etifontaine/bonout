describe("POST api/events", () => {
  it("should be an error if id don't exist", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/events",
      body: JSON.stringify({
        id: null,
        title: "test",
        description: "test",
        user_id: "test",
        address: "test",
        start_at: new Date().toDateString(),
        end_at: new Date().toDateString(),
        link: null,
      }),
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.be.equal(204);
    });
  });
});

describe("GET api/events", () => {
  it("should be an array", () => {
    cy.request("http://localhost:3000/api/events").then(
      response => {
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.be.greaterThan(0);
      }
    );
  });
});

describe("GET api/events/[id]", () => {
  it("should be an error if id don't exist", () => {
    cy.request({
      url: "http://localhost:3000/api/events/undefined",
      failOnStatusCode: false,
    }).then(response => {
      expect(response.body.error).to.be.equal(
        "Event not found !"
      );
    });
  });

  it("should be an object with id if it exist", () => {
    const id = "1";
    cy.request({
      url: `http://localhost:3000/api/events/${id}`,
      failOnStatusCode: false,
    }).then(response => {
      expect(response.body.id).to.be.equal(id);
    });
  });
});
