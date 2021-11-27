const fakedata = [
  {
    id: "1",
    user_id: "user1",
    link: "test-link-1",
  },
  {
    id: "2",
    user_id: "user2",
    link: "test-link-2",
    invitations: [
      {
        name: "test1",
      },
      {
        name: "test2",
      },
      {
        name: "test3",
      },
    ],
  },
  {
    user_id: "user3",
    id: "3",
    link: "test-link-3",
  },
];

modules.exports = {
  getEvents: jest.fn(() => {
    return fakedata;
  }),
  getEventsCount: jest.fn(() => {
    return fakedata.length;
  }),
  getEventByID: jest.fn((id) => {
    return fakedata.find((event) => event.id === id);
  }),
  getEventsByUserID: jest.fn((id) => {
    return fakedata.filter((event) => event.user_id === id);
  }),
  getEventByLink: jest.fn((link) => {
    return fakedata.find((event) => event.link === link);
  }),
  createEvent: (event) => {
    console.log(event);
    fakedata.push(event);

    return new Promise((resolve, reject) => {
      return resolve(event);
    });
  },
  deleteEvent: jest.fn((id) => {
    const index = fakedata.findIndex((event) => event.id === id);
    if (index !== -1) {
      fakedata.splice(index, 1);
    }
  }),
  createInvitationResponse: jest.fn((id, response) => {
    const eventIndex = fakedata.findIndex((event) => event.id === id);
    if (eventIndex !== -1) {
      const userInvitationIndex = fakedata[eventIndex].invitations.findindex(
        (invitation) => {
          return invitation.user_id === response.userId;
        }
      );
      if (userInvitationIndex !== -1) {
        fakedata[eventIndex].invitations[userInvitationIndex].response =
          response;
      } else {
        fakedata.invitations.push(response);
      }
    }
  }),

  deleteInvitationResponse: jest.fn((id, response) => {
    const eventIndex = fakedata.findIndex((event) => event.id === id);
    if (eventIndex) {
      const index = fakedata[eventIndex].invitations.findIndex(
        (invitation) => invitation.id === response.id
      );
      if (index !== -1) {
        fakedata[eventIndex].invitations.splice(index, 1);
      }
    }
  }),
};
