import express from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected with authentication
router.use(authMiddleware);

// Get all projects for the authenticated user
router.get('/', getProjects);

// Create a new project
router.post('/', createProject);

// Update a project
router.put('/:id', updateProject);

// Delete a project
router.delete('/:id', deleteProject);

export default router; 