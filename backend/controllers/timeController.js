export const getTimeEntries = (req, res) => {
    const fakeData = [
      { task: "Meeting", duration: "1h" },
      { task: "Coding", duration: "2h" }
    ];
    res.json(fakeData);
  };
  