module.exports = {
  FieldValue: {
    serverTimestamp: () => {
      return {
        toDate: () => {
          return new Date();
        },
      };
    },
    arrayUnion: () => {},
    arrayRemove: () => {},
  },
};
