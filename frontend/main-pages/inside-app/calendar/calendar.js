import { fileExists, loadStyle } from "../../../utils/domUtils.js";

window.pageInit = function() {
    const days = ["Su.", "Mo.", "Tu.", "We.", "Th.", "Fr.", "Sa."];
    let currentViewDate = getMonday(new Date()); // keeps track of the start of the current week

    /* ________________ SELECTED MONTH AND YEAR LOGIC ________________*/

    // Grabs the UI elements
    const newTimeEntryButton = document.getElementById("new-time-entry");
    const monthSelect = document.getElementById("month-select");
    const yearSelect = document.getElementById("year-select");
    const leftButton = document.getElementById("left-button");
    const rightButton = document.getElementById("right-button");
    const todayButton = document.getElementById("today");

    // Add event listeners to the UI elements
    newTimeEntryButton.addEventListener("click", () => newTimeEntry());
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

    getToday();
    const calendarContainer = document.querySelector('.calendar-container');
    const hourHeight = 60; // height of one hour block
    calendarContainer.scrollTop = hourHeight * 7 + 8; // scroll to 9 AM

    // Function to handle month/year change
    function handleDateChange() {
        // Get the select input (choosen month and year)
        const selectedMonth = monthSelect.value;
        const selectedYear = yearSelect.value;

        // Update the currentViewDate to the selected month and year
        currentViewDate = getMonday(new Date(selectedYear, selectedMonth - 1, 1));
        updateCalendar(selectedMonth, selectedYear);
    }

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
    const calendarDayHeader = document.querySelectorAll(".calendar-day");
    const calendarDayColumns = document.querySelectorAll(".day-column");
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

            calendarDayHeader[index].classList.remove("today");
            calendarDayColumns[index].classList.remove("today");

            // ✅ Highlight the current day column
            const today = new Date();
            const loopDate = new Date(currentViewDate);
            loopDate.setDate(loopDate.getDate() + index);

            // Compare day, month, year
            if (
                loopDate.getDate() === today.getDate() &&
                loopDate.getMonth() === today.getMonth() &&
                loopDate.getFullYear() === today.getFullYear()
            ) {
                calendarDayHeader[index].classList.add("today");
                calendarDayColumns[index].classList.add("today");
            }
        }
     });

    }

    // Next and previous week function that is added to the left and right buttons
    function nextWeek(right) {
        const delta = right ? 7 : -7;
        currentViewDate.setDate(currentViewDate.getDate() + delta);
    
        const updatedMonth = currentViewDate.getMonth() + 1; // JS month is 0-indexed
        const updatedYear = currentViewDate.getFullYear();
    
        monthSelect.value = updatedMonth;
        yearSelect.value = updatedYear;
    
        updateCalendar(updatedMonth, updatedYear, currentViewDate);
    }

    // Get's the current day of the system and shows as starting point in calendar
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

    // Creates a new Time Entry Pop Up
    async function newTimeEntry() {

        // Checks if a time entry is already shown
        if (document.querySelector(".time-entry-container")) {return; }

        const htmlPath = "/components/time-entry/time-entry.html";
        const cssPath = "/components/time-entry/time-entry.css";
      
        // Load CSS
        if (await fileExists(cssPath)) loadStyle(cssPath);
      
        // Load HTML
        const res = await fetch(htmlPath);
        const html = await res.text();
      
        // Inject into the DOM
        const mainContent = document.querySelector("main #main-content");
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;
        mainContent.appendChild(wrapper);
      
        // Make draggable (optional)
        makeDraggable(document.querySelector(".time-entry-container"));
      
        // Close entry
        wrapper.querySelector(".close-entry").addEventListener("click", () => {
          wrapper.remove();
        });

        // Create an event-block (time-entry) and then close the popUp
        wrapper.querySelector(".submit-entry").addEventListener("click", () => {
            wrapper.remove();
          });
      }


      // Makes an elemnet draggable (used for the time-entry container)
      function makeDraggable(element) {
        let isDown = false;
        let offset = [0, 0];
    
        const header = element.querySelector(".time-entry-header");
        const container = document.querySelector("main");
    
        header.addEventListener("mousedown", (e) => {
            isDown = true;
    
            // Get the element's absolute position on the page
            const rect = element.getBoundingClientRect();
            const scrollLeft = window.pageXOffset;
            const scrollTop = window.pageYOffset;
    
            // Freeze its current visual position
            element.style.left = `${rect.left + scrollLeft}px`;
            element.style.top = `${rect.top + scrollTop}px`;
            element.style.transform = "none";
    
            // Calculate offset between cursor and top-left corner of the element
            offset = [
                (rect.left + scrollLeft) - e.pageX,
                (rect.top + scrollTop) - e.pageY
            ];
    
            header.style.cursor = "grabbing";
        });
    
        document.addEventListener("mouseup", () => {
            isDown = false;
            header.style.cursor = "grab";
        });
    
        document.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
    
            const scrollLeft = window.pageXOffset;
            const scrollTop = window.pageYOffset;
    
            // New proposed position
            let newLeft = e.pageX + offset[0];
            let newTop = e.pageY + offset[1];
    
            // Optional bounds clamping (disable if it's locking up)
            const containerRect = container.getBoundingClientRect();
            const containerLeft = containerRect.left + scrollLeft;
            const containerTop = containerRect.top + scrollTop;
    
            const maxLeft = containerLeft + container.offsetWidth - element.offsetWidth;
            const maxTop = containerTop + container.offsetHeight - element.offsetHeight;
    
            // Clamp inside container (optional)
            newLeft = Math.max(containerLeft, Math.min(newLeft, maxLeft));
            newTop = Math.max(containerTop, Math.min(newTop, maxTop));
    
            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;
        });
    }

function adjustCalendarForMobile() {
    const isMobile = window.innerWidth <= 783;

    const allDays = document.querySelectorAll(".calendar-day");
    const allColumns = document.querySelectorAll(".day-column");

    const currentDayHeader = document.querySelector(".calendar-day.today");
    const currentDayColumn = document.querySelector(".day-column.today");

    if (isMobile) {
        // Remove all other calendar-day elements
        allDays.forEach((day) => {
            if (day !== currentDayHeader) {
                day.style.display = "none";
            }
        });

        // Remove all other day-column elements
        allColumns.forEach((column) => {
            if (column !== currentDayColumn) {
                column.style.display = "none";
            }
        });
    } else {
        // Restore all elements
        allDays.forEach((day) => {
            day.style.display = "";
        });
        allColumns.forEach((column) => {
            column.style.display = "";
        });
    }
}
adjustCalendarForMobile();
window.addEventListener("resize", adjustCalendarForMobile);

};