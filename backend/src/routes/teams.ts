import express from 'express';
import {
  createTeam,
  getMyTeams,
  getTeamById,
  joinTeam,
  leaveTeam,
  removeMember,
  deleteTeam,
  regenerateInviteCode,
} from '../controllers/teamController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Team CRUD
router.post('/', createTeam);
router.get('/', getMyTeams);
router.get('/:id', getTeamById);
router.delete('/:id', deleteTeam);

// Team membership
router.post('/join', joinTeam);
router.post('/:id/leave', leaveTeam);
router.delete('/:id/members/:memberId', removeMember);

// Invite code
router.post('/:id/regenerate-code', regenerateInviteCode);

export default router;
