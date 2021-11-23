// export function mockFirebase() {
// import { mockEvent } from "./mockEvent";
const mockEvent = require("./mockEvent");

const fakeData = [
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

module.exports = {
  initializeApp: jest.fn(),
  apps: [],
  credential: {
    cert: jest.fn(),
  },
  firestore: jest.fn(() => {
    return {
      collection: jest.fn(() => {
        return {
          add: jest.fn((b) => {
            return {
              get: jest.fn(() => {
                return new Promise((resolve, reject) => {
                  return resolve({
                    data: jest.fn(() => ({ ...b })),
                    id: "test-lol",
                  });
                });
              }),
            };
          }),
          orderBy: jest.fn(() => {
            return {
              get: jest.fn(() => {
                return new Promise((resolve, reject) => {
                  return resolve({
                    data: () => mockEvent,
                  });
                });
              }),
            };
          }),
          doc: jest.fn((id) => {
            return {
              set: jest.fn(() => {
                return Promise.resolve();
              }),
              get: jest.fn(() => {
                return new Promise((resolve, reject) => {
                  const _fakedata = fakeData.find((e) => e.id === id);
                  return resolve({
                    data: () => (_fakedata ? _fakedata : null),
                    id: _fakedata ? _fakedata.id : null,
                  });
                });
              }),
              update: jest.fn(
                () => new Promise((resolve, reject) => resolve())
              ),
            };
          }),
          where: jest.fn((attr, operator, value) => {
            return {
              get: jest.fn(() => {
                return new Promise((resolve, reject) => {
                  return resolve({
                    docs: fakeData
                      .filter((e) => {
                        return e[attr] === value;
                      })
                      .map((e) => {
                        return {
                          data: () => e,
                          id: e.id,
                        };
                      }),
                  });
                });
              }),
            };
          }),
        };
      }),
    };
  }),
};
