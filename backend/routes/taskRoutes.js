
import { Router } from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = Router();

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    // Find tasks that belong to the authenticated user or are assigned to them
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user.id },
        { assigneeId: req.user.id }
      ]
    })
      .populate('assigneeId', 'name email avatar')
      .populate('createdBy', 'name email avatar') // ✅ Add this
      .populate('projectId', 'name color');// 👈 Add this line to include the creator

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Create a task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assigneeId, projectId, tags } = req.body;
    
    // Create a new task
    const newTask = new Task({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      assigneeId: assigneeId || req.user.id, // Default to current user if no assignee
      projectId,
      tags,
      createdBy: req.user.id
    });
    
    await newTask.save();
    
    // Populate assignee and project data for response
    const populatedTask = await Task.findById(newTask._id)
      .populate('assigneeId', 'name email avatar')
      .populate('projectId', 'name color');
      
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assigneeId', 'name email avatar')
      .populate('projectId', 'name color');
      
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user has access to this task
    if (task.createdBy.toString() !== req.user.id && 
        task.assigneeId?._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assigneeId, projectId, tags } = req.body;
    
    // Find task and check access
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is creator or is currently assigned to the task
    if (task.createdBy.toString() !== req.user.id && 
        task.assigneeId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }
    
    // Update task fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (assigneeId) task.assigneeId = assigneeId;
    if (projectId) task.projectId = projectId;
    if (tags) task.tags = tags;
    
    await task.save();
    
    // Populate for response
    const updatedTask = await Task.findById(task._id)
      .populate('assigneeId', 'name email avatar')
      .populate('projectId', 'name color');
      
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Only task creator can delete
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }
    
    await Task.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
