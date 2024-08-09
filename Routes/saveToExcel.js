const express = require("express");
const DB = require("../DB");
const excel = require("exceljs");

const routerSaveToExcelGlob = express.Router();

//SaveToExcelGlobs

//afficher tous
routerSaveToExcelGlob.post("/SaveToExcelglobales", async (req, res, next) => {
	try {
		const pathFile = req.body.path;
		const rowData = req.body.row;
		console.log(rowData, pathFile);

		let workbook = new excel.Workbook();

		await workbook.xlsx.readFile(pathFile);
		let worksheet = workbook.getWorksheet("Feuil2");

		//  WorkSheet Header

		// Add Array Rows
		worksheet.addRow(1, rowData);

		// Write to File
		workbook.xlsx.writeFile(pathFile).then(function () {
			console.log("file saved!");
		});

		res.json(true);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

module.exports = routerSaveToExcelGlob;
