import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';
import Income from '../models/Income.js';
import { createReportWorkbook } from '../utils/excelGenerator.js';
import { getMonthRange, validateMonth } from '../utils/month.js';
import { buildMonthlyReport } from '../utils/reportMath.js';

async function loadReport(month) {
  const { start, end } = getMonthRange(month);
  const dateFilter = { date: { $gte: start, $lt: end } };
  const [budget, income, expenses] = await Promise.all([
    Budget.findOne({ month }).lean(),
    Income.find(dateFilter).sort({ date: -1, createdAt: -1 }).lean(),
    Expense.find(dateFilter).sort({ date: -1, createdAt: -1 }).lean(),
  ]);

  return buildMonthlyReport({ month, budget, income, expenses });
}

function invalidMonth(res) {
  return res.status(400).json({
    success: false,
    message: 'Month must use YYYY-MM format.',
  });
}

export async function getMonthlyReport(req, res) {
  if (!validateMonth(req.params.month)) {
    return invalidMonth(res);
  }

  try {
    const report = await loadReport(req.params.month);
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create monthly report.',
    });
  }
}

export async function exportMonthlyReport(req, res) {
  if (!validateMonth(req.params.month)) {
    return invalidMonth(res);
  }

  try {
    const report = await loadReport(req.params.month);
    const workbook = createReportWorkbook(report);

    res.status(200);
    res.attachment(`finance-report-${report.month}.xlsx`);
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to export monthly report.',
    });
  }
}
