const express = require("express");
const DB = require("../DB");

const routerAgentGlob = express.Router();

//AgentGlobs

//afficher tous
routerAgentGlob.get("/agentsglobales", async (req, res, next) => {
	try {
		let results = await DB.agent.all();
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//affichage / recherche by id
routerAgentGlob.get("/agentsglobales/:id", async (req, res, next) => {
	try {
		let results = await DB.agent.one(req.params.id);
		res.json(results || { error: "ID introuvable" });
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//ajout
//`id`, `nom`, `prenom`, `lastlogin`, `createdBy`, `login`, `password`, `status`
routerAgentGlob.post("/agentsglobales", async (req, res, next) => {
	try {
		let results = await DB.agent.addOne(
			req.body.nom,
			req.body.prenom,
			req.body.lastlogin,
			req.body.createdBy,
			req.body.login,
			req.body.password,
			req.body.status
		);
		const resultsUser = await DB.users.addOne(
			"",
			req.body.nom,
			req.body.prenom,
			req.body.password,
			"agent",
			"",
			req.body.login,
			"Verified"
		);
		res.json({ results, resultsUser });
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//edit
routerAgentGlob.put("/agentsglobales/:id", async (req, res, next) => {
	try {
		let results = await DB.agent.editOne(
			req.params.id,
			req.body.nom,
			req.body.prenom,
			req.body.lastlogin,
			req.body.createdBy,
			req.body.login,
			req.body.password,
			req.body.status
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//delete
routerAgentGlob.delete("/agentsglobales/:id", async (req, res, next) => {
	try {
		let results = await DB.agent.deleteOne(req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerAgentGlob.delete("/ManyAgent", async (req, res, next) => {
	try {
		let results = await DB.agent.deleteMany(req.body.liste);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
module.exports = routerAgentGlob;
