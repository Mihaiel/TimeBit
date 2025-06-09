// Load projects for the select dropdown
async function loadProjects() {
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
        
        // Add a default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a project';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        projectSelect.appendChild(defaultOption);
        
        // Add projects to select
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.title;
            projectSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        alert('Failed to load projects. Please try again.');
    }
}

// Calculate minutes between two times
function calculateMinutes(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return Math.round((end - start) / (1000 * 60));
}

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.time-entry-container');
    if (!form) return;

    // Load projects when the form is opened
    loadProjects();

    // Handle form submission
    form.querySelector('.submit-entry').addEventListener('click', async (e) => {
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
                form.remove();
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

    // Handle close button
    form.querySelector('.close-entry').addEventListener('click', () => {
        form.remove();
    });
});