import { API_ERROR_MESSAGES } from "../../../src/utils/errorMessages";

describe("POST api/events", () => {
  it("should be an error if body is empty", () => {
    postEvent(undefined).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq(API_ERROR_MESSAGES.BODY_EMPTY);
    });
  });

  it("should be an error if body is not a JSON", () => {
    postEvent("not a json").then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq(API_ERROR_MESSAGES.BODY_NOT_JSON);
    });
  });

  it("should be an error if property is missing", () => {
    postEvent(
      JSON.stringify({
        title: "test",
      })
    ).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq(
        "description, address, start_at, end_at, user_id" +
          API_ERROR_MESSAGES.PROPERTY_NOT_FOUND
      );
    });
  });

  it("should be an error if property is empty", () => {
    postEvent(
      JSON.stringify({
        ...fakeEvent(),
        title: "",
      })
    ).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq(
        "title" + API_ERROR_MESSAGES.SHOULD_NOT_BE_EMPTY
      );
    });
  });

  it("should be an error if property is not a string", () => {
    postEvent(
      JSON.stringify({
        ...fakeEvent(),
        title: 10,
      })
    ).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq(
        "title" + API_ERROR_MESSAGES.SHOULD_BE_STRING
      );
    });
  });

  console.log(`using ${process.env.DB_ENV}`);
  it("should be have 201 status be the same event as send", () => {
    postEvent(JSON.stringify(fakeEvent())).then(async (response) => {
      expect(response.status).to.be.equal(201);
      expect(response.body).to.be.an("object");
      const { id, created_at, link, ...rest } = response.body;
      expect(id).to.be.a("string");
      expect(created_at).to.be.a("string");
      expect(link).to.be.a("string");
      expect(rest).to.be.deep.equal(fakeEvent());
    });
  });
});

function postEvent(body) {
  return cy.request({
    method: "POST",
    url: "http://localhost:3000/api/events",
    body: body,
    failOnStatusCode: false,
  });
}

function fakeEvent() {
  return {
    title: "test",
    description: "test",
    user_id: "test",
    address: "test",
    start_at: new Date().toDateString(),
    end_at: new Date().toDateString(),
  };
}

// describe("GET api/events", () => {
//   it("should be an array", () => {
//     cy.request("http://localhost:3000/api/events").then((response) => {
//       expect(response.body).to.be.an("array");
//       expect(response.body.length).to.be.greaterThan(0);
//     });
//   });
// });

// const eventLink = (await postEvent(fakeEvent())).message;

describe("GET api/events/[...params]/[id/link]", () => {
  let event;
  before(() => {
    postEvent(JSON.stringify(fakeEvent())).then((response) => {
      event = response.body;
    });
  });

  it("should be an error if id don't exist", () => {
    cy.request({
      url: "http://localhost:3000/api/events/id/undefined",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body.error).to.be.equal(
        "Event" + API_ERROR_MESSAGES.NOT_FOUND
      );
    });
  });

  it("should be an error if link don't exist", () => {
    cy.request({
      url: "http://localhost:3000/api/events/link/undefined",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body.error).to.be.equal(
        "Event" + API_ERROR_MESSAGES.NOT_FOUND
      );
    });
  });

  it("should be an object with link if it exist [LINK]", () => {
    cy.request({
      url: `http://localhost:3000/api/events/link/${event.link}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body.link).to.be.equal(event.link);
    });
  });

  it("should be an object with id if it exist [ID]", () => {
    cy.request({
      url: `http://localhost:3000/api/events/id/${event.id}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body.id).to.be.equal(event.id);
      const { id, created_at, link, ...rest } = response.body;
      expect(id).to.be.a("string");
      expect(created_at).to.be.a("string");
      expect(link).to.be.a("string");
      expect(rest).to.be.deep.equal(fakeEvent());
    });
  });
});

// describe("POST api/events/invitations/response", () => {
//   let event;
//   before(() => {
//     postEvent(JSON.stringify(fakeEvent())).then((response) => {
//       event = response.body.message;
//     });
//   });
//   it("should be an error if response is not valid", () => {
//     cy.request({
//       method: "POST",
//       url: "http://localhost:3000/api/events/invitations/response",
//       body: JSON.stringify({
//         name: "cypress-test",
//         response: "yes",
//         link: eventLink,
//       }),
//       failOnStatusCode: false,
//     }).then((response) => {
//       expect(response.status).to.be.equal(201);
//     });
//   });

//   it("should be an error if request is not valid", () => {
//     cy.request({
//       method: "POST",
//       url: "http://localhost:3000/api/events/invitations/response",
//       body: JSON.stringify({
//         name: "cypress-test",
//         response: "bonout",
//         link: eventLink,
//       }),
//       failOnStatusCode: false,
//     }).then((response) => {
//       expect(response.status).to.be.equal(400);
//     });
//   });
// });
