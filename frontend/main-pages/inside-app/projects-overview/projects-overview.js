import { loadPage } from "../../../utils/contentLoader.js";
import { loadingScreen } from "../../../components/loading-screen/loading-screen.js";

window.pageInit = function () {
    const newProjectButton = document.querySelector("button.new-project");
    const ongoingProjectsContainer = document.querySelector(".project-container");
    const finishedProjectsContainer = document.querySelectorAll(".project-container")[1];
    const ongoingHeader = document.querySelector("h2.h-1.bold");
    const finishedHeader = document.querySelectorAll("h2.h-1.bold")[1];

    // Function to create a project element
    function createProjectElement(project) {
        const projectDiv = document.createElement('button');
        projectDiv.className = 'project box';
        
        const titleP = document.createElement('p');
        titleP.className = 'project-title';
        titleP.textContent = project.title;
        
        projectDiv.appendChild(titleP);

        // Add click handler to load project details
        projectDiv.addEventListener('click', () => {
            // Store the project data in localStorage
            localStorage.setItem('currentProject', JSON.stringify(project));
            // Load the projects page
            loadPage("projects");
        });

        return projectDiv;
    }

    // Function to load projects
    async function loadProjects() {
        try {
            // Show loading screen
            loadingScreen.show();

            const response = await fetch('/projects', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            const data = await response.json();
            
            // Handle ongoing projects
            if (ongoingProjectsContainer) {
                // Remove all project elements except the new project button
                const projects = ongoingProjectsContainer.querySelectorAll('.project:not(.new-project)');
                projects.forEach(project => project.remove());

                // Add ongoing projects before the new project button
                data.ongoing.forEach(project => {
                    ongoingProjectsContainer.insertBefore(createProjectElement(project), newProjectButton);
                });

                // Update ongoing projects count
                if (ongoingHeader) {
                    ongoingHeader.textContent = `Ongoing Projects ${data.ongoing.length}`;
                }
            }

            // Handle finished projects
            if (finishedProjectsContainer) {
                // Clear all existing projects
                finishedProjectsContainer.innerHTML = '';

                // Add finished projects
                data.finished.forEach(project => {
                    finishedProjectsContainer.appendChild(createProjectElement(project));
                });

                // Update finished projects count
                if (finishedHeader) {
                    finishedHeader.textContent = `Finished Projects ${data.finished.length}`;
                }
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            alert('Failed to load projects. Please try again.');
        } finally {
            // Hide loading screen
            loadingScreen.hide();
        }
    }

    // Load projects when page initializes
    loadProjects();

    if (newProjectButton) {
        newProjectButton.addEventListener("click", function () {
            // Clear any existing project data when creating new project
            localStorage.removeItem('currentProject');
            loadPage("projects");
        });
    }
};