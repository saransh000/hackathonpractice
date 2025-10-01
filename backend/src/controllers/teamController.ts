import { Request, Response } from 'express';
import Team from '../models/Team';
import crypto from 'crypto';

// Generate unique invite code
const generateInviteCode = (): string => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Create a new team
export const createTeam = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.id;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Team name is required',
      });
    }

    // Generate unique invite code
    let inviteCode = generateInviteCode();
    let codeExists = await Team.findOne({ inviteCode });
    
    while (codeExists) {
      inviteCode = generateInviteCode();
      codeExists = await Team.findOne({ inviteCode });
    }

    const team = await Team.create({
      name,
      description,
      owner: userId,
      members: [userId],
      inviteCode,
    });

    await team.populate('members', 'name email');
    await team.populate('owner', 'name email');

    res.status(201).json({
      success: true,
      data: { team },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create team',
    });
  }
};

// Get all teams for current user
export const getMyTeams = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const teams = await Team.find({
      members: userId,
    })
      .populate('owner', 'name email')
      .populate('members', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { teams },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch teams',
    });
  }
};

// Get team by ID
export const getTeamById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const team = await Team.findById(id)
      .populate('owner', 'name email role')
      .populate('members', 'name email role');

    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found',
      });
    }

    // Check if user is a member
    const isMember = team.members.some(
      (member: any) => member._id.toString() === userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'You are not a member of this team',
      });
    }

    res.status(200).json({
      success: true,
      data: { team },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch team',
    });
  }
};

// Join team using invite code
export const joinTeam = async (req: Request, res: Response): Promise<any> => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user?.id;

    if (!inviteCode) {
      return res.status(400).json({
        success: false,
        error: 'Invite code is required',
      });
    }

    const team = await Team.findOne({ inviteCode: inviteCode.toUpperCase() });

    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Invalid invite code',
      });
    }

    // Check if already a member
    if (team.members.includes(userId as any)) {
      return res.status(400).json({
        success: false,
        error: 'You are already a member of this team',
      });
    }

    // Add user to team
    team.members.push(userId as any);
    await team.save();

    await team.populate('members', 'name email role');
    await team.populate('owner', 'name email role');

    res.status(200).json({
      success: true,
      message: `Successfully joined ${team.name}`,
      data: { team },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to join team',
    });
  }
};

// Leave team
export const leaveTeam = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found',
      });
    }

    // Check if user is the owner
    if (team.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        error: 'Team owner cannot leave. Transfer ownership or delete the team.',
      });
    }

    // Remove user from members
    team.members = team.members.filter(
      (member) => member.toString() !== userId
    );
    await team.save();

    res.status(200).json({
      success: true,
      message: 'Successfully left the team',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to leave team',
    });
  }
};

// Remove member from team (owner only)
export const removeMember = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id, memberId } = req.params;
    const userId = req.user?.id;

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found',
      });
    }

    // Check if user is the owner
    if (team.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only team owner can remove members',
      });
    }

    // Cannot remove owner
    if (team.owner.toString() === memberId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot remove team owner',
      });
    }

    // Remove member
    team.members = team.members.filter(
      (member) => member.toString() !== memberId
    );
    await team.save();

    await team.populate('members', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: { team },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to remove member',
    });
  }
};

// Delete team (owner only)
export const deleteTeam = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found',
      });
    }

    // Check if user is the owner
    if (team.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only team owner can delete the team',
      });
    }

    await team.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete team',
    });
  }
};

// Regenerate invite code (owner only)
export const regenerateInviteCode = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found',
      });
    }

    // Check if user is the owner
    if (team.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only team owner can regenerate invite code',
      });
    }

    // Generate new unique invite code
    let inviteCode = generateInviteCode();
    let codeExists = await Team.findOne({ inviteCode });
    
    while (codeExists) {
      inviteCode = generateInviteCode();
      codeExists = await Team.findOne({ inviteCode });
    }

    team.inviteCode = inviteCode;
    await team.save();

    res.status(200).json({
      success: true,
      message: 'Invite code regenerated successfully',
      data: { inviteCode: team.inviteCode },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to regenerate invite code',
    });
  }
};
