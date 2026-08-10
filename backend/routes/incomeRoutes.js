import express from 'express';

import {
  getIncome,
  addIncome,
  deleteIncome,
} from '../controllers/incomeController.js';

const router = express.Router();

router
  .route('/')
  .get(getIncome)
  .post(addIncome);

router
  .route('/:id')
  .delete(deleteIncome);

export default router;