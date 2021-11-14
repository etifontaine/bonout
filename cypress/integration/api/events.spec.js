const eventLink = `cypress-test-${Math.random().toString(36).substr(2, 9)}`

describe("POST api/events", () => {
  console.log(`using ${process.env.DB_ENV}`)
  it("should be an error if id don't exist", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/events",
      body: JSON.stringify({
        title: "test",
        description: "test",
        user_id: "test",
        address: "test",
        start_at: new Date().toDateString(),
        end_at: new Date().toDateString(),
        link: eventLink,
      }),
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.be.equal(201);
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

  it("should be an object with link if it exist", () => {
    cy.request({
      url: `http://localhost:3000/api/events/link/${eventLink}`,
      failOnStatusCode: false,
    }).then(response => {
      expect(response.body.link).to.be.equal(eventLink);
    });
  });
});

describe("POST api/events/invitations/response", () => {
  it("should be an error if response is not valid", () => {
    cy.request({
      method: 'POST',
      url: "http://localhost:3000/api/events/invitations/response",
      body: JSON.stringify({
        name: "cypress-test",
        response: "yes",
        link: eventLink
      }),
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.be.equal(201);
    });
  })
})

describe("POST api/events/invitations/response", () => {
  it("should be an error if request is not valid", () => {
    cy.request({
      method: 'POST',
      url: "http://localhost:3000/api/events/invitations/response",
      body: JSON.stringify({
        name: "cypress-test",
        response: "bonout",
        link: eventLink
      }),
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.be.equal(400);
    });
  })
})