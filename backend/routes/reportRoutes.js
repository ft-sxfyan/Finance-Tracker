import express from 'express';

import {
  exportMonthlyReport,
  getMonthlyReport,
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/:month/export', exportMonthlyReport);
router.get('/:month', getMonthlyReport);

export default router;
