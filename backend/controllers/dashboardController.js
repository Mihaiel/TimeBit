// controllers/dashboardController.js
export const getDashboardData = (req, res) => {
    const fakeData = {
      totalHours: 274,
      ongoingProjects: 3,
      finishedProjects: 5,
      dayStreak: 2,
      hoursNeededThisWeek: 20,
      hoursDoneThisWeek: 11.4
    };
  
    res.json(fakeData);
  };