const express = require("express");
const DB = require("../DB");

const routerImagesupload = express.Router();

//AgentGlobs

//afficher tous
routerImagesupload.get(
	"/imageupload/getimages/:idAnnonce",
	async (req, res, next) => {
		try {
			let results = await DB.imageUpload.getImage(req.params.idAnnonce);
			res.json(results);
		} catch (e) {
			console.log(e);
			res.sendStatus(500);
		}
	}
);

//ajout
//`id`, `nom`, `prenom`, `lastlogin`, `createdBy`, `login`, `password`, `status`
function readImageFile(file) {
	// read binary data from a file:
	const fs = require("fs");
	const bitmap = fs.readFileSync(file);
	const buf = new Buffer(bitmap);
	return buf;
}
routerImagesupload.post("/imageupload/upload", async (req, res, next) => {
	try {
		const inputfile = req.body.img;
		const allImagesPromise = inputfile.map(async (file) => {
			const data = readImageFile(file);
			return await DB.imageUpload.insertImage(data, req.body.idAnnonce);
		});
		const results = Promise.all(allImagesPromise).then((res) => {
			return res;
		});
		res.json(results);
		//let results = await DB.imageUpload.insertImage(data, req.body.idAnnonce);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//delete
routerImagesupload.delete("/imageupload/delete/:id", async (req, res, next) => {
	try {
		let results = await DB.imageUpload.deleteImage(req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
module.exports = routerImagesupload;
