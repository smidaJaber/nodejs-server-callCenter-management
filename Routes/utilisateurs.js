const express = require("express");
const DB = require("../DB");

const routerUtilisateur = express.Router();

//Fournisseurs

//afficher tous
routerUtilisateur.get("/utilisateurs", async (req, res, next) => {
	try {
		let results = await DB.utilisateurs.all();
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//affichage / recherche by id
routerUtilisateur.get("/utilisateurs/:id", async (req, res, next) => {
	try {
		let results = await DB.utilisateurs.one(req.params.id);
		res.json(results || { error: "ID introuvable" });
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//ajout
routerUtilisateur.post("/utilisateurs", async (req, res, next) => {
	try {
		let results = await DB.utilisateurs.addOne(
			req.body.login,
			req.body.password,
			req.body.type,
			req.body.dateCreation,
			req.body.allowedModule,
			req.session.passport.user.id
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//edit
routerUtilisateur.put("/utilisateurs/:id", async (req, res, next) => {
	try {
		let results = await DB.utilisateurs.editOne(
			req.params.id,
			req.body.login,
			req.body.password,
			req.body.type,
			req.body.dateCreation,
			req.body.allowedModule,
			req.session.passport.user.id
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//delete
routerUtilisateur.delete("/utilisateurs/:id", async (req, res, next) => {
	try {
		let results = await DB.utilisateurs.deleteOne(req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
module.exports = routerUtilisateur;
