
import { Router } from 'express';
import Team from '../models/Team.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = Router();

// Get all teams the user is a member of
router.get('/', auth, async (req, res) => {
  try {
    // Find teams where the user is the owner or a member
    const teams = await Team.find({
      $or: [
        { ownerId: req.user.id },
        { members: req.user.id }
      ]
    }).populate('ownerId', 'name email avatar')
      .populate('members', 'name email avatar');

    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new team
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, members } = req.body;

    // Create new team with the authenticated user as owner
    const newTeam = new Team({
      name,
      description,
      ownerId: req.user.id,
      members: members || []
    });

    // Add owner to members if not already included
    if (!newTeam.members.includes(req.user.id)) {
      newTeam.members.push(req.user.id);
    }

    await newTeam.save();

    // Populate owner and member details for the response
    const populatedTeam = await Team.findById(newTeam._id)
      .populate('ownerId', 'name email avatar')
      .populate('members', 'name email avatar');

    res.status(201).json(populatedTeam);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get team by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('ownerId', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is a member or owner of the team
    if (team.ownerId._id.toString() !== req.user.id &&
      !team.members.some(member => member._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this team' });
    }

    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update team
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description } = req.body;

    // Find team and check ownership
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Only team owner can update team details
    if (team.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this team' });
    }

    // Update team fields
    if (name) team.name = name;
    if (description !== undefined) team.description = description;

    await team.save();

    // Populate for response
    const updatedTeam = await Team.findById(team._id)
      .populate('ownerId', 'name email avatar')
      .populate('members', 'name email avatar');

    res.json(updatedTeam);
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete team
router.delete('/:id/leave', auth, async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const isOwner = team.ownerId.toString() === userId;
    const isMember = team.members.some(memberId => memberId.toString() === userId);

    if (!isOwner && !isMember) {
      return res.status(400).json({ message: "You're not a member of this team" });
    }

    // Remove user from members array
    team.members = team.members.filter(memberId => memberId.toString() !== userId);

    // Handle owner leaving
    if (isOwner) {
      if (team.members.length === 0) {
        // Delete team if no members left
        await Team.deleteOne({ _id: teamId });
        return res.json({ message: "You left and the team was deleted (no members left)" });
      } else {
        // Assign new owner randomly
        const newOwnerId = team.members[Math.floor(Math.random() * team.members.length)];
        team.ownerId = newOwnerId;
      }
    }

    await team.save();
    res.json({ message: 'Left the team successfully' });

  } catch (error) {
    console.error('Error leaving team:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add member to team by email invitation
router.post('/:id/members/invite', auth, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Find team and check ownership
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Only team owner can add members
    if (team.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add members to this team' });
    }

    // Check if user is already a member
    if (team.members.includes(user._id)) {
      return res.status(400).json({ message: 'User is already a team member' });
    }

    // Add member
    team.members.push(user._id);
    await team.save();

    // Populate for response
    const updatedTeam = await Team.findById(team._id)
      .populate('ownerId', 'name email avatar')
      .populate('members', 'name email avatar');

    res.json(updatedTeam);
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Leave team
router.delete('/:id/leave', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is a member of the team
    if (!team.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are not a member of this team' });
    }

    // Cannot leave if user is the owner
    if (team.ownerId.toString() === req.user.id) {
      return res.status(400).json({ message: 'Team owner cannot leave. Transfer ownership or delete the team instead.' });
    }

    // Remove user from members
    team.members = team.members.filter(member => member.toString() !== req.user.id);
    await team.save();

    res.json({ message: 'Successfully left the team' });
  } catch (error) {
    console.error('Error leaving team:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove member from team
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    // Find team
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Allow team owner to remove any member, or allow a member to remove themselves
    if (team.ownerId.toString() !== req.user.id && req.params.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to remove this member' });
    }

    // Cannot remove the owner from their own team
    if (req.params.userId === team.ownerId.toString()) {
      return res.status(400).json({ message: 'Cannot remove the team owner' });
    }

    // Remove member
    team.members = team.members.filter(member => member.toString() !== req.params.userId);
    await team.save();

    // Populate for response
    const updatedTeam = await Team.findById(team._id)
      .populate('ownerId', 'name email avatar')
      .populate('members', 'name email avatar');

    res.json(updatedTeam);
  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
