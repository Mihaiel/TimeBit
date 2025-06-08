import { loadPage } from "../../../utils/contentLoader.js";

window.pageInit = function () {
    const backButton = document.querySelector(".button-black");
    const projectForm = document.getElementById("projectForm");
    const pageTitle = document.querySelector(".project-title");
    const submitButton = document.querySelector("button[type='submit']");
    const projectTypeTag = document.querySelector(".project-type-tag");

    // Set minimum date for date inputs to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').min = today;
    document.getElementById('end-date').min = today;

    // Load project data if it exists
    const currentProject = JSON.parse(localStorage.getItem('currentProject'));
    if (currentProject) {
        // Update title and button based on project status
        if (currentProject.status === 'finished') {
            pageTitle.textContent = currentProject.title;
            projectTypeTag.textContent = 'FINISHED PROJECT';
        } else {
            pageTitle.textContent = currentProject.title;
            projectTypeTag.textContent = 'ONGOING PROJECT';
        }
        submitButton.textContent = 'Update';

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
        // Reset to default for new project
        pageTitle.textContent = 'Create a new Project';
        projectTypeTag.textContent = 'NEW PROJECT';
        submitButton.textContent = 'Create';
    }

    if (backButton) {
        backButton.addEventListener("click", function () {
            loadPage("projects-overview");
        });
    }

    if (projectForm) {
        projectForm.addEventListener("submit", async function (e) {
            e.preventDefault();

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