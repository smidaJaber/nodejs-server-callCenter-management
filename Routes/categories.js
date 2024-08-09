const express = require("express");
const DB = require("../DB");

const routerCategGlob = express.Router();

//subCategGlobs

//afficher tous
routerCategGlob.get("/categories", async (req, res, next) => {
	try {
		let results = await DB.categories.all();
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//affichage / recherche by id
routerCategGlob.get("/categories/:id", async (req, res, next) => {
	try {
		let results = await DB.categories.one(req.params.id);
		res.json(results || { error: "ID introuvable" });
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//ajout
routerCategGlob.post("/categories", async (req, res, next) => {
	try {
		let results = await DB.categories.addOne(req.body.nom);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//edit
routerCategGlob.put("/categories/:id", async (req, res, next) => {
	try {
		let results = await DB.categories.editOne(req.body.nom, req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//delete
routerCategGlob.delete("/categories/:id", async (req, res, next) => {
	try {
		let results = await DB.categories.deleteOne(req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
module.exports = routerCategGlob;
