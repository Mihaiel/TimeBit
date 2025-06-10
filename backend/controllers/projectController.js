import Project from '../models/project.js';
import User from '../models/user.js';
import { sendProjectCreationNotification } from './notificationController.js';

// Get all projects for the authenticated user
export const getProjects = async (req, res) => {
    try {
        const id = req.user.id;
        
        const projects = await Project.findAll({
            where: { user_id: id },
            order: [
                ['status', 'ASC'],
                ['start_date', 'DESC']
            ]
        });
        
        // Separate projects into ongoing and finished
        const ongoingProjects = projects.filter(project => project.status === 'ongoing');
        const finishedProjects = projects.filter(project => project.status === 'finished');
        
        res.json({
            ongoing: ongoingProjects,
            finished: finishedProjects
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};

// Create a new project
export const createProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, category, description, weekly_hours, start_date, end_date, background_image_url, notify } = req.body;
        
        // Get user's email
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const project = await Project.create({
            user_id: userId,
            title,
            category,
            description,
            weekly_hours,
            start_date,
            end_date,
            background_image_url,
            notify,
            status: 'ongoing'
        });

        // Send project creation notification
        try {
            await sendProjectCreationNotification(user.email, {
                title,
                category,
                description,
                weekly_hours,
                start_date,
                end_date
            });
        } catch (notificationError) {
            // Log the error but don't fail the project creation
            console.error('Failed to send project creation notification:', notificationError);
        }
        
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
};

// Update a project
export const updateProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const projectId = req.params.id;
        
        // First check if the project belongs to the user
        const project = await Project.findOne({
            where: {
                id: projectId,
                user_id: userId
            }
        });
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found or unauthorized' });
        }
        
        const { title, category, description, weekly_hours, start_date, end_date, background_image_url, notify, status } = req.body;
        
        // Update the project
        await project.update({
            title,
            category,
            description,
            weekly_hours,
            start_date,
            end_date,
            background_image_url,
            notify,
            status
        });
        
        res.json(project);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
};

// Delete a project
export const deleteProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const projectId = req.params.id;
        
        const project = await Project.findOne({
            where: {
                id: projectId,
                user_id: userId
            }
        });
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found or unauthorized' });
        }
        
        await project.destroy();
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
}; 