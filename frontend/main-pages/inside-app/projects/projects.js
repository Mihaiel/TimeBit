import { loadPage } from "../../../utils/contentLoader.js";

window.pageInit = function () {
    const backButton = document.querySelector(".button-black");
    const projectForm = document.getElementById("projectForm");
    const pageTitle = document.querySelector(".project-title");
    const submitButton = document.querySelector("button[type='submit']");
    const projectTypeTag = document.querySelector(".project-type-tag");
    const deleteButton = document.querySelector(".delete-project");
    const statusButton = document.querySelector(".status-project");

    // Set minimum date for date inputs to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').min = today;
    document.getElementById('end-date').min = today;

    // Load project data if it exists
    const currentProject = JSON.parse(localStorage.getItem('currentProject'));
    if (currentProject) {
        // Show/hide buttons based on whether we're editing an existing project
        deleteButton.style.display = 'block';
        statusButton.style.display = 'block';
        submitButton.textContent = 'Update';

        // Update status button text based on current status
        statusButton.textContent = currentProject.status === 'finished' ? 'Move to ongoing' : 'Move to finished';

        // Update title and tag based on project status
        if (currentProject.status === 'finished') {
            pageTitle.textContent = currentProject.title;
            projectTypeTag.textContent = 'FINISHED PROJECT';
        } else {
            pageTitle.textContent = currentProject.title;
            projectTypeTag.textContent = 'ONGOING PROJECT';
        }

        // Fill form with project data
        projectForm.title.value = currentProject.title;
        projectForm.category.value = currentProject.category;
        projectForm.description.value = currentProject.description || '';
        projectForm.weekly_hours.value = currentProject.weekly_hours;
        projectForm.start_date.value = currentProject.start_date.split('T')[0];
        if (currentProject.end_date) {
            projectForm.end_date.value = currentProject.end_date.split('T')[0];
        }
        projectForm.notify.checked = currentProject.notify;
    } else {
        // Hide buttons for new project
        deleteButton.style.display = 'none';
        statusButton.style.display = 'none';
        pageTitle.textContent = 'Create a new Project';
        projectTypeTag.textContent = 'NEW PROJECT';
        submitButton.textContent = 'Create';
    }

    // Handle delete button click
    deleteButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                const response = await fetch(`/projects/${currentProject.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete project');
                }

                alert('Project deleted successfully!');
                localStorage.removeItem('currentProject');
                loadPage("projects-overview");
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project. Please try again.');
            }
        }
    });

    // Handle status change button click
    statusButton.addEventListener('click', async () => {
        const newStatus = currentProject.status === 'finished' ? 'ongoing' : 'finished';
        try {
            const response = await fetch(`/projects/${currentProject.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...currentProject,
                    status: newStatus
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update project status');
            }

            alert(`Project moved to ${newStatus} successfully!`);
            localStorage.removeItem('currentProject');
            loadPage("projects-overview");
        } catch (error) {
            console.error('Error updating project status:', error);
            alert('Failed to update project status. Please try again.');
        }
    });

    if (backButton) {
        backButton.addEventListener("click", function () {
            loadPage("projects-overview");
        });
    }

    // Handle form submission
    if (projectForm) {
        // Add submit event listener to the submit button instead of the form
        submitButton.addEventListener("click", async function (e) {
            e.preventDefault();

            // Validate form
            if (!projectForm.checkValidity()) {
                projectForm.reportValidity();
                return;
            }

            // Get form data
            const formData = new FormData(projectForm);
            const projectData = {
                title: formData.get('title'),
                category: formData.get('category'),
                description: formData.get('description'),
                weekly_hours: parseInt(formData.get('weekly_hours')),
                start_date: formData.get('start_date'),
                end_date: formData.get('end_date') || null,
                notify: formData.get('notify') === 'on',
                background_image_url: null // Will be handled separately if needed
            };

            try {
                const url = currentProject ? `/projects/${currentProject.id}` : '/projects';
                const method = currentProject ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(projectData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to save project');
                }

                // Show success message
                alert(currentProject ? 'Project updated successfully!' : 'Project created successfully!');
                
                // Clear current project data
                localStorage.removeItem('currentProject');
                
                // Redirect back to projects overview
                loadPage("projects-overview");
            } catch (error) {
                console.error('Error saving project:', error);
                alert(error.message || 'Failed to save project. Please try again.');
            }
        });
    }
};