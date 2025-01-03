const express = require('express');
const { createDailyInventoryReportAdmin, getInventoryReportsAdmin, createDailySalesReportAdmin, getSalesReportsAdmin, updateInventoryReportNames } = require('../../controllers/AdminControllers/AdminReportController');

const router = express.Router();

//routes for inventory report
// router.post('/createDailyInventoryReportAdmin', createDailyInventoryReportAdmin);
router.get('/getInventoryReportsAdmin', getInventoryReportsAdmin);
router.post('/updateInventoryReportNames', updateInventoryReportNames);

// //routes for sales report
// router.post('/createDailySalesReportAdmin', createDailySalesReportAdmin);
router.get('/getSalesReportsAdmin', getSalesReportsAdmin);

module.exports = router;