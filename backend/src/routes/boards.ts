import express from 'express';
import {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  addTeamMember,
  removeTeamMember,
  createBoardValidation,
  updateBoardValidation,
  getBoardsValidation
} from '../controllers/boardController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getBoardsValidation, getBoards)
  .post(createBoardValidation, createBoard);

router.route('/:id')
  .get(getBoard)
  .put(updateBoardValidation, updateBoard)
  .delete(deleteBoard);

router.route('/:id/members')
  .post(addTeamMember);

router.route('/:id/members/:userId')
  .delete(removeTeamMember);

export default router;