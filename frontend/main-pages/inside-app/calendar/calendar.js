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

    // Load time entries after updating the calendar
    loadTimeEntries();
    }

    // Next and previous week (or day) function that is added to the left and right buttons
    function nextWeek(right) {
        const isMobile = window.innerWidth <= 783;
        const delta = right ? (isMobile ? 1 : 7) : (isMobile ? -1 : -7);

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

        // Load projects for the select dropdown
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Get the users projects
            const response = await fetch('/projects', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server response:', errorData);
                throw new Error(`Failed to fetch projects: ${errorData.message || response.statusText}`);
            }
            
            const projects = await response.json();
            console.log('Received projects:', projects);

            const projectSelect = document.querySelector('#project-select');
            if (!projectSelect) {
                throw new Error('Project select element not found');
            }
            
            // Clear existing options
            projectSelect.innerHTML = '';
            
            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select a project';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            projectSelect.appendChild(defaultOption);
            
            // Add projects to select
            if (Array.isArray(projects)) {
                projects.forEach(project => {
                    const option = document.createElement('option');
                    option.value = project.id;
                    option.textContent = project.title;
                    projectSelect.appendChild(option);
                });
            } else if (projects.ongoing || projects.finished) {
                // Handle the case where projects are separated into ongoing and finished
                [...(projects.ongoing || []), ...(projects.finished || [])].forEach(project => {
                    const option = document.createElement('option');
                    option.value = project.id;
                    option.textContent = project.title;
                    projectSelect.appendChild(option);
                });
            } else {
                throw new Error('Unexpected projects data format');
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            alert(`Failed to load projects: ${error.message}`);
        }

        // Handle form submission
        wrapper.querySelector(".submit-entry").addEventListener("click", async (e) => {
            e.preventDefault();

            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to create time entries');
                return;
            }

            const projectId = document.querySelector('#project-select').value;
            const date = document.querySelector('#date').value;
            const startTime = document.querySelector('#starting_time').value;
            const endTime = document.querySelector('#ending_time').value;
            const notes = document.querySelector('textarea').value;

            // Validate required fields
            if (!projectId || !date || !startTime || !endTime) {
                alert('Please fill in all required fields');
                return;
            }

            // Validate time order
            if (startTime >= endTime) {
                alert('End time must be after start time');
                return;
            }

            try {
                const response = await fetch('/time-entry', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        project_id: parseInt(projectId),
                        date,
                        start_time: startTime,
                        end_time: endTime,
                        notes
                    }),
                });

                if (response.ok) {
                    const timeEntry = await response.json();
                    // Close the form
                    wrapper.remove();
                    // Refresh the calendar view
                    window.dispatchEvent(new CustomEvent('timeEntryCreated', { detail: timeEntry }));
                } else {
                    const error = await response.json();
                    alert('Failed to save time entry: ' + error.message);
                }
            } catch (error) {
                console.error('Error saving time entry:', error);
                alert('Error saving time entry. Please try again.');
            }
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

// Load time entries for the current view
async function loadTimeEntries() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    const startDate = new Date(currentViewDate);
    const endDate = new Date(currentViewDate);
    endDate.setDate(endDate.getDate() + 6); // Add 6 days to get the end of the week

    const response = await fetch(`/time-entry?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch time entries');
    
    const timeEntries = await response.json();
    displayTimeEntries(timeEntries);
  } catch (error) {
    console.error('Error loading time entries:', error);
  }
}

// Display time entries in the calendar
function displayTimeEntries(timeEntries) {
  // Clear existing time entries
  document.querySelectorAll('.time-entry-block').forEach(block => block.remove());

  timeEntries.forEach(entry => {
    const entryDate = new Date(entry.date);
    const dayIndex = (entryDate.getDay() + 6) % 7; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
    const dayColumn = document.querySelectorAll('.day-column')[dayIndex];
    
    if (!dayColumn) return;

    const startTime = new Date(`2000-01-01T${entry.start_time}`);
    const endTime = new Date(`2000-01-01T${entry.end_time}`);
    
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const duration = (endTime - startTime) / (1000 * 60); // Duration in minutes
    
    const timeSlot = dayColumn.querySelector(`.time-slot:nth-child(${startHour + 1})`);
    if (!timeSlot) return;

    const entryBlock = document.createElement('div');
    entryBlock.className = 'time-entry-block';
    entryBlock.style.top = `${(startMinute / 60) * 100}%`;
    entryBlock.style.height = `${(duration / 60) * 100}%`;
    
    // Format time to show only hours and minutes (5 String characters only so example: 14:30 not more)
    const formatTime = (timeStr) => {
      return timeStr ? timeStr.slice(0, 5) : '';
    };
    
    entryBlock.innerHTML = `
      <div class="entry-title">${entry.Project.title}</div>
      <div class="entry-time">${formatTime(entry.start_time)} - ${formatTime(entry.end_time)}</div>
      ${entry.notes ? `<div class="entry-notes">${entry.notes}</div>` : ''}
    `;

    // Make the entry block clickable
    entryBlock.style.cursor = 'pointer';
    entryBlock.addEventListener('click', () => editTimeEntry(entry));
    
    timeSlot.appendChild(entryBlock);
  });
}

// Function to load and display existing time entry for editing
async function editTimeEntry(entry) {
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
  
    // Make draggable
    makeDraggable(document.querySelector(".time-entry-container"));

    // Load projects and set the current project
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch('/projects', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const projects = await response.json();
        const projectSelect = document.querySelector('#project-select');
        
        // Clear existing options
        projectSelect.innerHTML = '';
        
        // Add projects to select
        if (Array.isArray(projects)) {
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.title;
                if (project.id === entry.project_id) {
                    option.selected = true;
                }
                projectSelect.appendChild(option);
            });
        } else if (projects.ongoing || projects.finished) {
            [...(projects.ongoing || []), ...(projects.finished || [])].forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.title;
                if (project.id === entry.project_id) {
                    option.selected = true;
                }
                projectSelect.appendChild(option);
            });
        }

        // Set the form values
        document.querySelector('#date').value = entry.date;
        document.querySelector('#starting_time').value = entry.start_time.slice(0, 5);
        document.querySelector('#ending_time').value = entry.end_time.slice(0, 5);
        document.querySelector('textarea').value = entry.notes || '';

        // Update the submit button text
        const submitButton = wrapper.querySelector('.submit-entry');
        submitButton.textContent = 'Update';

        // Handle form submission
        submitButton.addEventListener('click', async (e) => {
            e.preventDefault();

            const projectId = document.querySelector('#project-select').value;
            const date = document.querySelector('#date').value;
            const startTime = document.querySelector('#starting_time').value;
            const endTime = document.querySelector('#ending_time').value;
            const notes = document.querySelector('textarea').value;

            // Validate required fields
            if (!projectId || !date || !startTime || !endTime) {
                alert('Please fill in all required fields');
                return;
            }

            // Validate time order
            if (startTime >= endTime) {
                alert('End time must be after start time');
                return;
            }

            try {
                const response = await fetch(`/time-entry/${entry.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        project_id: parseInt(projectId),
                        date,
                        start_time: startTime,
                        end_time: endTime,
                        notes
                    }),
                });

                if (response.ok) {
                    const updatedEntry = await response.json();
                    // Close the form
                    wrapper.remove();
                    // Refresh the calendar view
                    loadTimeEntries();
                } else {
                    const error = await response.json();
                    alert('Failed to update time entry: ' + error.message);
                }
            } catch (error) {
                console.error('Error updating time entry:', error);
                alert('Error updating time entry. Please try again.');
            }
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        alert('Failed to load projects. Please try again.');
    }

    // Handle close button
    wrapper.querySelector('.close-entry').addEventListener('click', () => {
        wrapper.remove();
    });
}

// Listen for new time entries
window.addEventListener('timeEntryCreated', () => {
  loadTimeEntries();
});

};