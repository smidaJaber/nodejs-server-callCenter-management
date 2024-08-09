const express = require("express");
const DB = require("../DB");

const routerDepense = express.Router();

//Depenses

//afficher tous
routerDepense.get("/tabledepense", async (req, res, next) => {
	try {
		let results = await DB.tabledepense.all();
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//affichage / recherche by id
routerDepense.get("/tabledepense/:id", async (req, res, next) => {
	try {
		let results = await DB.tabledepense.one(req.params.id);
		res.json(results || { error: "ID introuvable" });
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//ajout
routerDepense.post("/tabledepense", async (req, res, next) => {
	try {
		let results = await DB.tabledepense.addOne(
			req.body.IDTypeDepense,
			req.body.montant,
			req.body.IDCateg,
			req.body.information,
			req.body.date,
			req.body.document,
			req.body.numero,
			"userID"
		);

		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//edit
routerDepense.put("/tabledepense/:id", async (req, res, next) => {
	try {
		let results = await DB.tabledepense.editOne(
			req.params.id,
			req.body.IDTypeDepense,
			req.body.montant,
			req.body.IDCateg,
			req.body.information,
			req.body.date,
			req.body.document,
			req.body.numero,
			"userID"
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//delete
routerDepense.delete("/tabledepense/:id", async (req, res, next) => {
	try {
		let results = await DB.tabledepense.deleteOne(req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
module.exports = routerDepense;
