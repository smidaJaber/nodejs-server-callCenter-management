const express = require("express");
const DB = require("../DB");

const routerClient = express.Router();

//clients

//afficher tous
routerClient.get("/clients", async (req, res, next) => {
	try {
		let results = await DB.clients.all();
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//affichage / recherche by id
routerClient.get("/clients/:id", async (req, res, next) => {
	try {
		let results = await DB.clients.one(req.params.id);
		res.json(results || { error: "ID introuvable" });
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//ajout
routerClient.post("/clients", async (req, res, next) => {
	try {
		let results = await DB.clients.addOne(
			req.body.nomClient,
			req.body.adressClient,
			req.body.mobile,
			req.body.fixe,
			req.body.email,
			req.body.fax,
			req.body.specialite,
			req.body.noteClient,
			req.body.RIB,
			req.body.matricule,
			req.body.statutClient,
			req.body.infoClient,
			req.body.typeClient,
			"userid"
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//edit
routerClient.put("/clients/:id", async (req, res, next) => {
	try {
		let results = await DB.clients.editOne(
			req.params.id,
			req.body.nomClient,
			req.body.adressClient,
			req.body.mobile,
			req.body.fixe,
			req.body.email,
			req.body.fax,
			req.body.specialite,
			req.body.noteClient,
			req.body.RIB,
			req.body.matricule,
			req.body.statutClient,
			req.body.infoClient,
			req.body.typeClient,
			"userid"
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//delete
routerClient.delete("/clients/:id", async (req, res, next) => {
	try {
		let results = await DB.clients.deleteOne(req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
module.exports = routerClient;
