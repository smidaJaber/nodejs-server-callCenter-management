const express = require("express");
const DB = require("../DB");

const routerEnginsGlob = express.Router();

//EnginsGlobs

//afficher tous
routerEnginsGlob.get("/camionsglobales", async (req, res, next) => {
	try {
		let results = await DB.camionsglobales.all();
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//affichage / recherche by id
routerEnginsGlob.get("/camionsglobales/:id", async (req, res, next) => {
	try {
		let results = await DB.camionsglobales.one(req.params.id);
		res.json(results || { error: "ID introuvable" });
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerEnginsGlob.get(
	"/camionsglobalesByAnnonce/:id",
	async (req, res, next) => {
		try {
			let results = await DB.camionsglobales.oneByAnnonce(req.params.id);
			res.json(results || { error: "ID introuvable" });
		} catch (e) {
			console.log(e);
			res.sendStatus(500);
		}
	}
);

//ajout
routerEnginsGlob.post("/camionsglobales", async (req, res, next) => {
	try {
		let results = await DB.camionsglobales.addOne(
			req.body.date,
			req.body.dPartement,
			req.body.marque,
			req.body.modL,
			req.body.fonction,
			req.body.boiteDeVitesse,
			req.body.kms,
			req.body.annE,
			req.body.couleur,
			req.body.commentaire,
			req.body.options,
			req.body.essieux,
			req.body.etat,
			req.body.etatCarrosserie,
			req.body.susAvant,
			req.body.susArriere,
			req.body.prix,
			req.body.coordVendeur,
			req.body.id,
			req.body.subCateg,
			req.body.idAnnonce,
			req.body.ref
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//edit
routerEnginsGlob.put("/camionsglobales/:id", async (req, res, next) => {
	try {
		let results = await DB.camionsglobales.editOne(
			req.body.date,
			req.body.dPartement,
			req.body.marque,
			req.body.modL,
			req.body.fonction,
			req.body.boiteDeVitesse,
			req.body.kms,
			req.body.annE,
			req.body.couleur,
			req.body.commentaire,
			req.body.options,
			req.body.essieux,
			req.body.etat,
			req.body.etatCarrosserie,
			req.body.susAvant,
			req.body.susArriere,
			req.body.prix,
			req.body.coordVendeur,
			req.body.id,
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
routerEnginsGlob.delete("/camionsglobales/:id", async (req, res, next) => {
	try {
		let results = await DB.camionsglobales.deleteOne(req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
module.exports = routerEnginsGlob;
