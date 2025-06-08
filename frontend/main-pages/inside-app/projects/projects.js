import { loadPage } from "../../../utils/contentLoader.js";

window.pageInit = function () {
    const backButton = document.querySelector(".button-black");
    const projectForm = document.getElementById("projectForm");

    // Set minimum date for date inputs to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').min = today;
    document.getElementById('end-date').min = today;

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
                const response = await fetch('/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(projectData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to create project');
                }

                // Show success message
                alert('Project created successfully!');
                
                // Redirect back to projects overview
                loadPage("projects-overview");
            } catch (error) {
                console.error('Error creating project:', error);
                alert(error.message || 'Failed to create project. Please try again.');
            }
        });
    }
};