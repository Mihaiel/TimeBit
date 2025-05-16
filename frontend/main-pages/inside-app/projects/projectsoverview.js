//Test data
const ongoingProjects = [
    {title: "Project A", img: "frontend\assets\images\foto1.png", alt:"This is the first project" },
    {title: "Project B", img: "frontend\assets\images\foto2.jpg", alt:"This is the second project" },
    {title: "Project C", img: "frontend\assets\images\foto3.jpg", alt:"This is the third project" },
    {title: "Project D", img: "frontend\assets\images\foto4.jpg", alt:"This is the fourth project" },
    {title: "Project E", img: "frontend\assets\images\this.jpg", alt:"This is the fifth project" },
];

const finishedProjects = [
    {title: "Minesweeper", img: "frontend\assets\images\minesweeper.png", alt: "This is minesweeper"}
];

// grab the containers by their IDs
const ongoingProjectsContainer = document.getElementById("ongoing-projects");
const finishedProjectsContainer = document.getElementById("finished-projects");

// function to create a project card
function createProjectCard( {title, img, alt}) {
    const card = document.createElement("div");
    card.classList.add("project-card");

    if (img) {
        card.innerHTML = `
            <h3 class="project-title">${title}</h3>
            <img src="${img}" alt="${alt}" class="project-image">           
        `;
    } else {
        card.innerHTML = <p class="project-title">${title}</p>; 
}
    return card;
}

// append ongoing projects to the container
ongoingProjects.forEach(project => {
  const card = createProjectCard(project);
  ongoingContainer.appendChild(card);
});

// append finished projects to the container
finishedProjects.forEach(project => {
  const card = createProjectCard(project);
  finishedContainer.appendChild(card);
});

// Create the "Create New Project" card
const createNewCard = document.createElement('div');
createNewCard.className = 'project-card create-new';
createNewCard.innerHTML = `
  <div class="plus">+</div>
  <p class="title">Create New Project</p>
`;

// Add click event to redirect
createNewCard.addEventListener('click', () => {
  window.location.href = 'projects.html';
});

// Append "Create New Project" card at the end of ongoing projects
ongoingContainer.appendChild(createNewCard);
