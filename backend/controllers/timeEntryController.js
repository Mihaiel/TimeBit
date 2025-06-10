import { Op } from 'sequelize';
import { TimeEntry } from '../models/TimeEntry.js';
import Project from '../models/project.js';
import User from '../models/user.js';

// Create a new time entry
export const createTimeEntry = async (req, res) => {
  try {
    const { project_id, date, start_time, end_time, notes } = req.body;
    const user_id = req.user.id;

    // Calculate minutes between start and end time
    const start = new Date(`2000-01-01T${start_time}`);
    const end = new Date(`2000-01-01T${end_time}`);
    const minutes = Math.round((end - start) / (1000 * 60));

    const timeEntry = await TimeEntry.create({
      user_id,
      project_id,
      date,
      start_time,
      end_time,
      minutes,
      notes
    });

    res.status(201).json(timeEntry);
  } catch (error) {
    console.error('Error creating time entry:', error);
    res.status(500).json({ error: 'Failed to create time entry' });
  }
};

// Get time entries for a specific date range
export const getTimeEntries = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const user_id = req.user.id;

    const timeEntries = await TimeEntry.findAll({
      where: {
        user_id,
        date: {
          [Op.between]: [start_date, end_date]
        }
      },
      include: [
        {
          model: Project,
          attributes: ['title', 'category']
        }
      ],
      order: [['date', 'ASC'], ['start_time', 'ASC']]
    });

    res.json(timeEntries);
  } catch (error) {
    console.error('Error fetching time entries:', error);
    res.status(500).json({ error: 'Failed to fetch time entries' });
  }
};

export const updateTimeEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { project_id, date, start_time, end_time, notes } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!project_id || !date || !start_time || !end_time) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Find the time entry
        const timeEntry = await TimeEntry.findOne({
            where: { id, user_id: userId }
        });

        if (!timeEntry) {
            return res.status(404).json({ message: 'Time entry not found' });
        }

        // Calculate minutes
        const start = new Date(`2000-01-01T${start_time}`);
        const end = new Date(`2000-01-01T${end_time}`);
        const minutes = Math.round((end - start) / (1000 * 60));

        // Update the time entry
        await timeEntry.update({
            project_id,
            date,
            start_time,
            end_time,
            minutes,
            notes
        });

        // Fetch the updated entry with project details
        const updatedEntry = await TimeEntry.findOne({
            where: { id },
            include: [{
                model: Project,
                attributes: ['title']
            }]
        });

        res.json(updatedEntry);
    } catch (error) {
        console.error('Error updating time entry:', error);
        res.status(500).json({ message: 'Error updating time entry' });
    }
}; 