const express = require("express");
const DB = require("../DB");

const routerSettings = express.Router();

//Fournisseurs

//afficher tous
routerSettings.get("/settings", async (req, res, next) => {
	try {
		let results = await DB.settings.all();
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerSettings.post("/getFilePath", async (req, res, next) => {
	try {
		console.log("reqFiles", req.data);
		res.json("response data");
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
//edit

routerSettings.put("/settingsCamion", async (req, res, next) => {
	try {
		let results = await DB.settings.editCamionPath(
			1,

			req.body.path
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerSettings.put("/settingsEngin", async (req, res, next) => {
	try {
		let results = await DB.settings.editEnginPath(
			1,

			req.body.path
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerSettings.put("/settingsAgent", async (req, res, next) => {
	try {
		let results = await DB.settings.editAgentPath(
			1,

			req.body.path
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

module.exports = routerSettings;
