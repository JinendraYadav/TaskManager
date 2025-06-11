
import { Router } from 'express';
import Project from '../models/Project.js';
import auth from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = Router();

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    // Find projects where the user is either the owner or a member
    const projects = await Project.find({
      $or: [
        { ownerId: req.user.id },
        { members: req.user.id }
      ]
    }).populate('ownerId', 'name email avatar');
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    const newProject = new Project({
      name,
      description,
      color: color || '#9b87f5', // Default color if not provided
      ownerId: req.user.id,
      members: [req.user.id] // Add creator as the first member
    });
    
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get project by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('ownerId', 'name email avatar')
      .populate('members', 'name email avatar');
      
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has access to this project
    if (project.ownerId.toString() !== req.user.id && 
        !project.members.some(member => member._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    // Find project and check access
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Only owner can update project details
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    // Update fields
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (color) project.color = color;
    
    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Only owner can delete the project
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    
    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add member to project
router.post('/:id/members', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Find project and check access
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Only owner can add members
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add members to this project' });
    }
    
    // Check if user is already a member
    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a project member' });
    }
    
    // Add member
    project.members.push(userId);
    await project.save();
    
    // Return updated project with populated members
    const updatedProject = await Project.findById(req.params.id)
      .populate('ownerId', 'name email avatar')
      .populate('members', 'name email avatar');
      
    res.json(updatedProject);
  } catch (error) {
    console.error('Error adding project member:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get tasks for a specific project
router.get('/:id/tasks', auth, async (req, res) => {
  try {
    // Find project and check access
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has access to this project
    if (project.ownerId.toString() !== req.user.id && 
        !project.members.some(member => member.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    // Find tasks for this project
    const Task = mongoose.model('Task');
    const tasks = await Task.find({ projectId: req.params.id })
      .populate('assigneeId', 'name email avatar')
      .populate('createdBy', 'name email avatar');
      
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
