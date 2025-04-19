window.pageInit = function() {
    const days = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];
    let currentViewDate = getMonday(new Date()); // keeps track of the start of the current week

    /* ________________ SELECTED MONTH AND YEAR LOGIC ________________*/

    // Grabs the UI elements
    const monthSelect = document.getElementById("month-select");
    const yearSelect = document.getElementById("year-select");
    const leftButton = document.getElementById("left-button");
    const rightButton = document.getElementById("right-button");
    const todayButton = document.getElementById("today");

    // Add event listeners to the UI elements
    monthSelect.addEventListener("change", handleDateChange);
    yearSelect.addEventListener("change", handleDateChange);
    leftButton.addEventListener("click", () => nextWeek(false));
    rightButton.addEventListener("click", () => nextWeek(true));    
    todayButton.addEventListener("click", () => getToday());

    // Set current month as selected
    const currentMonth = new Date().getMonth() + 1; // +1 because getMonth() is 0-based
    monthSelect.value = currentMonth.toString();

    // Set current year as selected 
    const currentYear = new Date().getFullYear();
    yearSelect.value = currentYear.toString();

    // Function to handle month/year change
    function handleDateChange() {
        // Get the select input (choosen month and year)
        const selectedMonth = monthSelect.value;
        const selectedYear = yearSelect.value;

        // Update the currentViewDate to the selected month and year
        currentViewDate = getMonday(new Date(selectedYear, selectedMonth - 1, 1));
        updateCalendar(selectedMonth, selectedYear);
    }

    getToday();

    
    // Function that returns the Weekdays
    function getWeekDays(startDate) {
        const week = [];
        const date = new Date(startDate);
        
        for (let i = 0; i < 7; i++) {
            const dayName = days[date.getDay()];
            const dayNum = String(date.getDate()).padStart(2, '0');
            week.push(`${dayName} ${dayNum}`);
            date.setDate(date.getDate() + 1);
        }

        return week;
    }

    // Get Monday functions returns always a date that starts from a monday
    function getMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }


    /** 
    * UPDATE CALENDAR HANDLER
    * This updats the calendar view based on the selected month and year
    * @param {string} month -> the month that the user selected
    * @param {string} year -> the year that the user selected
    */
    function updateCalendar(month, year, startDate = null){

    // Get the first day of the selected month and year
    const updatedDate = new Date(year, month - 1, 1); // Month is 0-indexed in JavaScript
    const startFrom = startDate ? new Date(startDate) : getMonday(updatedDate);
    currentViewDate = startFrom;
    
    // Select all the calendar days, and get the week labels
    const dayObject = document.querySelectorAll(".calendar-day .day-text");
    const weekLabels = getWeekDays(startFrom);

    dayObject.forEach((el, index) => {
        if (weekLabels[index]) {
            const fullDay = weekLabels[index]; // e.g., "Monday 08"
            const dayNumber = fullDay.split(" ")[1];

            // Clear existing content inside the div first
            el.innerHTML = "";

            // Create and append a <p> with the day text
            const fullDayName = document.createElement("p");
            fullDayName.textContent = fullDay;
            el.appendChild(fullDayName);

            // When the Day is '01', add a text that displays the months name
            if (dayNumber == "01") {
                const dayTextLabel = document.createElement("p");

                // Create an actual date for this day in the loop
                const date = new Date(currentViewDate);
                date.setDate(date.getDate() + index);

                // Get the correct month name for this "01"
                const monthName = date.toLocaleString("default", { month: "long" });

                // Add the month name as a label
                dayTextLabel.textContent = monthName;
                el.appendChild(dayTextLabel);
            }
        }
     });

    }

    // Function that is attached to the left and right buttons
    function nextWeek(right) {
        const delta = right ? 7 : -7;
        currentViewDate.setDate(currentViewDate.getDate() + delta);
    
        const updatedMonth = currentViewDate.getMonth() + 1; // JS month is 0-indexed
        const updatedYear = currentViewDate.getFullYear();
    
        monthSelect.value = updatedMonth;
        yearSelect.value = updatedYear;
    
        updateCalendar(updatedMonth, updatedYear, currentViewDate);
    }

    function getToday() {
        const today = new Date();
        const monday = getMonday(today);

        currentViewDate = monday;

        const updatedMonth = monday.getMonth() + 1;
        const updatedYear = monday.getFullYear();

        // Update the dropdowns
        monthSelect.value = updatedMonth;
        yearSelect.value = updatedYear;

        updateCalendar(updatedMonth, updatedYear, monday);
    }

};
