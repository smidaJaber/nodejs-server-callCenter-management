const express = require("express");
const DB = require("../DB");

const routersubCategGlob = express.Router();
const { WebSocket } = require("ws");
//subCategGlobs

//afficher tous
routersubCategGlob.get("/subcategories", async (req, res, next) => {
	try {
		let results = await DB.subcategories.all();
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//affichage / recherche by id
routersubCategGlob.get("/subcategories/:id", async (req, res, next) => {
	try {
		let results = await DB.subcategories.one(req.params.id);
		res.json(results || { error: "ID introuvable" });
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//ajout
routersubCategGlob.post("/subcategories", async (req, res, next) => {
	try {
		let results = await DB.subcategories.addOne(
			req.body.idParent,
			req.body.nom
		);
		var io = req.app.get("socketio");

		io.clients.forEach(function each(client) {
			if (client !== io && client.readyState === WebSocket.OPEN) {
				client.send(
					JSON.stringify({
						senderId: req.user.id,
						type: "updateFromAPIAnnonces",
						data:
							req.user.firstName +
							" " +
							req.user.lastName +
							" a ajouté une SousCategorie :" +
							req.body.nom,
					}),
					{ binary: false }
				);
			}
		});

		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//edit
routersubCategGlob.put("/subcategories/:id", async (req, res, next) => {
	try {
		let results = await DB.subcategories.editOne(
			req.body.idParent,
			req.body.nom,
			req.params.id
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//delete
routersubCategGlob.delete("/subcategories/:id", async (req, res, next) => {
	try {
		let results = await DB.subcategories.deleteOne(req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
module.exports = routersubCategGlob;
