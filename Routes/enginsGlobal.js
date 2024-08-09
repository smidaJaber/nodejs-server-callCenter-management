const express = require("express");
const DB = require("../DB");

const routerEnginsGlob = express.Router();

//EnginsGlobs

//afficher tous
routerEnginsGlob.get("/enginsglobales", async (req, res, next) => {
	try {
		let results = await DB.enginsglobales.all();
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//affichage / recherche by id
routerEnginsGlob.get("/enginsglobales/:id", async (req, res, next) => {
	try {
		let results = await DB.enginsglobales.one(req.params.id);
		res.json(results || { error: "ID introuvable" });
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerEnginsGlob.get(
	"/enginsglobalesByIdAnnonce/:id",
	async (req, res, next) => {
		try {
			let results = await DB.enginsglobales.oneByIdAnnonce(req.params.id);
			res.json(results || { error: "ID introuvable" });
		} catch (e) {
			console.log(e);
			res.sendStatus(500);
		}
	}
);

//ajout
routerEnginsGlob.post("/enginsglobales", async (req, res, next) => {
	try {
		let results = await DB.enginsglobales.addOne(
			req.body.date,
			req.body.dPartement,
			req.body.marque,
			req.body.ref,
			req.body.nbrHeur,
			req.body.nbrGodet,
			req.body.fissureSoudure,
			req.body.disponibilite,
			req.body.typeBras,
			req.body.peiture,
			req.body.etatChinile,
			req.body.prix,
			req.body.commentaire,
			req.body.coordVendeur,
			req.body.subCateg,
			req.body.id,
			req.body.idAnnonce
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//edit
routerEnginsGlob.put("/enginsglobales/:id", async (req, res, next) => {
	try {
		let results = await DB.enginsglobales.editOne(
			req.params.id,
			req.body.date,
			req.body.dPartement,
			req.body.marque,
			req.body.ref,
			req.body.nbrHeur,
			req.body.nbrGodet,
			req.body.fissureSoudure,
			req.body.disponibilite,
			req.body.typeBras,
			req.body.peiture,
			req.body.etatChinile,
			req.body.prix,
			req.body.commentaire,
			req.body.coordVendeur,
			req.body.subCateg,
			req.body.idAnnonce
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//delete
routerEnginsGlob.delete("/enginsglobales/:id", async (req, res, next) => {
	try {
		let results = await DB.enginsglobales.deleteOne(req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
module.exports = routerEnginsGlob;
