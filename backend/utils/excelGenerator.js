import ExcelJS from 'exceljs';

const currencyFormat = 'Rs. #,##0.00';

function styleHeader(row) {
  row.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  row.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0D5C73' },
  };
}

function addRecordSheet(workbook, title, columns, records) {
  const sheet = workbook.addWorksheet(title);
  sheet.columns = columns;
  styleHeader(sheet.addRow(columns.map((column) => column.header)));
  records.forEach((record) => sheet.addRow(record));
  sheet.getColumn('amount').numFmt = currencyFormat;
  sheet.views = [{ state: 'frozen', ySplit: 1 }];
  return sheet;
}

export function createReportWorkbook(report) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Finance Core';
  workbook.created = new Date();

  const summary = workbook.addWorksheet('Summary');
  summary.columns = [
    { header: 'Metric', key: 'metric', width: 28 },
    { header: 'Amount', key: 'amount', width: 20 },
  ];
  styleHeader(summary.addRow(['Metric', 'Amount']));
  [
    ['Month', report.month],
    ['Monthly Allowance', report.allowance],
    ['Income Received', report.totalIncome],
    ['Expenses', report.totalExpenses],
    ['Remaining Balance', report.remaining],
  ].forEach((row) => summary.addRow(row));
  summary.getColumn('amount').numFmt = currencyFormat;

  const categories = workbook.addWorksheet('Categories');
  categories.columns = [
    { header: 'Category', key: 'category', width: 28 },
    { header: 'Amount', key: 'amount', width: 20 },
  ];
  styleHeader(categories.addRow(['Category', 'Amount']));
  report.categories.forEach((category) => categories.addRow(category));
  categories.getColumn('amount').numFmt = currencyFormat;

  addRecordSheet(
    workbook,
    'Expenses',
    [
      { header: 'Date', key: 'date', width: 16 },
      { header: 'Item', key: 'item', width: 28 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Payment Method', key: 'paymentMethod', width: 20 },
      { header: 'Amount', key: 'amount', width: 18 },
    ],
    report.expenses
  );
  addRecordSheet(
    workbook,
    'Income',
    [
      { header: 'Date', key: 'date', width: 16 },
      { header: 'Source', key: 'source', width: 28 },
      { header: 'Amount', key: 'amount', width: 18 },
    ],
    report.income
  );

  return workbook;
}
