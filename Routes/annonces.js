const express = require("express");
const DB = require("../DB");
const Moment = require("moment");
const routerAnnonces = express.Router();
const { WebSocket } = require("ws");
//

//afficher tous
routerAnnonces.get("/annonces", async (req, res, next) => {
	try {
		let results = await DB.annonce.all();
		let images = await DB.imageUpload.all();

		const final_results = results.map((ann) => {
			ann.images = images.filter((img) => parseInt(img.idAnnonce) === ann.id);
			return ann;
		});
		res.json(final_results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//affichage / recherche by id
routerAnnonces.get("/annonces/:id", async (req, res, next) => {
	try {
		let results = await DB.annonce.one(req.params.id);
		let images = await DB.imageUpload.getImage(req.params.id);
		if (results) {
			results.images = images;
		}

		res.json(results || { error: "ID introuvable" });
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//ajout
function readImageFile(file) {
	// read binary data from a file:
	const buf = new Buffer.from(file.dataURL.toString(), "base64");
	return buf;
	/*const fs = require("fs");
	const bitmap = fs.readFileSync(file.dataURL);
	const buf = new Buffer(bitmap);
	return buf;
	const reader = new FileReader();
	reader.onloadend = () => {
		// log to console
		// logs data:<type>;base64,wL2dvYWwgbW9yZ...
		console.log(reader.result);
		return reader.result;
	};
	reader.readAsDataURL(file);*/
}
routerAnnonces.post("/annonces", async (req, res, next) => {
	try {
		const connectedUserId = req.user.id;
		const annonce = req.body.annonce;
		const camion = req.body.annonce.camion;
		const engin = req.body.annonce.engin;

		const titleAnn =
			annonce.typeOfArticle === "C"
				? annonce.textSubCategorie + " " + camion.marque + " " + camion.modL
				: annonce.textSubCategorie + " " + engin.MARQUE;

		const resultsAnnonce = await DB.annonce.addOne(
			titleAnn,
			connectedUserId,
			annonce.revisedBy,
			annonce.description,
			"notset",
			annonce.ref,
			Moment().format("YYYY-MM-DD HH:mm:ss"),
			annonce.views,
			annonce.id_cam_engin,
			annonce.status,
			annonce.idCateg,
			annonce.idSubCateg
		);
		const inputfile = annonce.images;
		const lastIDAnnonce = resultsAnnonce.insertId;
		const FinalReference =
			Moment().format("YYYY") + "/" + lastIDAnnonce.toString().padStart(4, "0");
		const allImagesPromise = inputfile.map(async (file) => {
			const data = readImageFile(JSON.parse(file));
			return await DB.imageUpload.insertImage(data, lastIDAnnonce);
		});
		const resultsImages = Promise.all(allImagesPromise).then((res) => {
			return res;
		});
		const resultsCamionEngin =
			annonce.typeOfArticle === "C"
				? await DB.camionsglobales.addOne(
						Moment(camion.date, "DD/MM/YYYY").format("YYYY-MM-DD"),
						camion.dPartement,
						camion.marque,
						camion.modL,
						camion.fonction,
						camion.boiteDeVitesse,
						camion.kms,
						camion.annE,
						camion.couleur,
						camion.commentaire,
						JSON.stringify(camion.options),
						camion.essieux,
						camion.etat,
						camion.etatCarrosserie,
						camion.susAvant,
						camion.susArriere,
						camion.prix,
						JSON.stringify(camion.coordVendeur),
						camion.id,
						camion.subCateg,
						lastIDAnnonce,
						FinalReference
				  )
				: await DB.enginsglobales.addOne(
						Moment(engin.date, "DD/MM/YYYY").format("YYYY-MM-DD"),
						engin.dep,
						engin.MARQUE,
						FinalReference,
						engin.heures,
						engin.nb_godets,
						engin.fissure,
						engin.disponibilite,
						engin.bras,
						engin.peinture,
						engin.etatChinile,
						engin.prix,
						engin.commentaire,
						JSON.stringify(engin.coordVendeur),
						engin.subCateg,
						engin.id,
						lastIDAnnonce
				  );
		const os = require("os");
		const dirCamsXLS =
			os.userInfo().homedir +
			"\\Documents\\ZSC\\archive_excel\\tabCamionsGlobale.xlsx";
		const dirEnginsXLS =
			os.userInfo().homedir +
			"\\Documents\\ZSC\\archive_excel\\tabEnginsGlobale.xlsx";
		const fileExcel = annonce.typeOfArticle === "C" ? dirCamsXLS : dirEnginsXLS;
		const editorName = await DB.users.one(annonce.createdBy);
		const resultsExcel = await DB.annonce.writeToExcel(
			fileExcel,
			annonce,
			FinalReference,
			editorName
		);
		var io = req.app.get("socketio");
		io.clients.forEach(function each(client) {
			if (client !== io && client.readyState === WebSocket.OPEN) {
				client.send(
					JSON.stringify({
						senderId: connectedUserId,
						type: "updateFromAPIAnnonces",
						data:
							req.user.firstName +
							" " +
							req.user.lastName +
							" a jouté une annonce :" +
							titleAnn,
					}),
					{ binary: false }
				);
			}
		});

		res.json({
			resultsAnnonce,
			resultsImages,
			resultsCamionEngin,
			resultsExcel,
		});
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//edit
routerAnnonces.put("/annonces-update/:id", async (req, res, next) => {
	try {
		const connectedUserId = req.user.id;
		const annonce = req.body.annonce;
		const camion = req.body.annonce.camion;
		const engin = req.body.annonce.engin;
		const titleAnn =
			annonce.typeOfArticle === "C"
				? annonce.textSubCategorie + " " + camion.marque + " " + camion.modL
				: annonce.textSubCategorie + " " + engin.MARQUE;
		const resultsAnnonce = await DB.annonce.editOne(
			req.params.id,
			titleAnn,
			annonce.createdBy,
			connectedUserId,
			annonce.description,
			"notset",
			annonce.ref,
			annonce.createdAt,
			Moment().format("YYYY-MM-DD HH:MM:SS"),
			annonce.views,
			annonce.id_cam_engin,
			annonce.status,
			annonce.idCateg,
			annonce.idSubCateg
		);
		const inputfile = annonce.images;
		const lastIDAnnonce = req.params.id;
		const FinalReference = annonce.ref;
		let imagesDeleteResults;
		let resultsImages;
		if (inputfile.length) {
			imagesDeleteResults = await DB.imageUpload.deleteImagesByIdAnnonce(
				lastIDAnnonce
			);
			const allImagesPromise = inputfile.map(async (file) => {
				const data = readImageFile(JSON.parse(file));
				return await DB.imageUpload.insertImage(data, lastIDAnnonce);
			});
			resultsImages = Promise.all(allImagesPromise).then((res) => {
				return res;
			});
		}

		const resultsCamionEngin =
			annonce.typeOfArticle === "C"
				? await DB.camionsglobales.editOne(
						Moment(camion.date, "DD/MM/YYYY").format("YYYY-MM-DD"),
						camion.dPartement,
						camion.marque,
						camion.modL,
						camion.fonction,
						camion.boiteDeVitesse,
						camion.kms,
						camion.annE,
						camion.couleur,
						camion.commentaire,
						JSON.stringify(camion.options),
						camion.essieux,
						camion.etat,
						camion.etatCarrosserie,
						camion.susAvant,
						camion.susArriere,
						camion.prix,
						JSON.stringify(camion.coordVendeur),
						camion.id,
						camion.subCateg,
						lastIDAnnonce
				  )
				: await DB.enginsglobales.editOne(
						Moment(engin.date, "DD/MM/YYYY").format("YYYY-MM-DD"),
						engin.dep,
						engin.MARQUE,
						FinalReference,
						engin.heures,
						engin.nb_godets,
						engin.fissure,
						engin.disponibilite,
						engin.bras,
						engin.peinture,
						engin.etatChinile,
						engin.prix,
						engin.commentaire,
						JSON.stringify(engin.coordVendeur),
						engin.subCateg,
						engin.id,
						lastIDAnnonce
				  );
		const os = require("os");
		const dirCamsXLS =
			os.userInfo().homedir +
			"\\Documents\\ZSC\\archive_excel\\tabCamionsGlobale.xlsx";
		const dirEnginsXLS =
			os.userInfo().homedir +
			"\\Documents\\ZSC\\archive_excel\\tabEnginsGlobale.xlsx";
		const fileExcel = annonce.typeOfArticle === "C" ? dirCamsXLS : dirEnginsXLS;
		const editorName = await DB.users.one(annonce.createdBy);

		const resultsExcel = await DB.annonce.editExcel(
			fileExcel,
			annonce,
			FinalReference,
			editorName
		);

		var io = req.app.get("socketio");

		io.clients.forEach(function each(client) {
			if (client !== io && client.readyState === WebSocket.OPEN) {
				client.send(
					JSON.stringify({
						senderId: connectedUserId,
						type: "updateFromAPIAnnonces",
						data:
							req.user.firstName +
							" " +
							req.user.lastName +
							" a modifié une annonce :" +
							titleAnn,
					}),
					{ binary: false }
				);
			}
		});

		res.json({
			resultsAnnonce,
			imagesDeleteResults,
			resultsImages,
			resultsCamionEngin,
			resultsExcel,
		});
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//delete
routerAnnonces.delete("/annonces/:id", async (req, res, next) => {
	try {
		let results = await DB.annonce.deleteOne(req.params.id);

		let resCamion = await DB.camionsglobales.deleteByAnnonce(req.params.id);
		let resEngin = await DB.enginsglobales.deleteByAnnonce(req.params.id);
		const fileExcel = req.body.file;
		/*const resultsExcel = await DB.annonce.deleteRowExcel(
			fileExcel,
			annonce,
			req.params.id
		);*/
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerAnnonces.delete("/ManyAnnonces", async (req, res, next) => {
	try {
		const liste = req.body.liste.split(",");
		const filesExcel = req.body.files;

		let results = await DB.annonce.deleteMany(liste);
		const reqCamions = liste.map(async (IdAnn) => {
			return await DB.camionsglobales.deleteByAnnonce(IdAnn);
		});
		const reqEngins = liste.map(async (IdAnn) => {
			return await DB.enginsglobales.deleteByAnnonce(IdAnn);
		});
		/*const reqExel = liste.map(async (IdAnn, index) => {
			return await DB.annonce.deleteRowExcel(
				filesExcel[index].path,
				filesExcel[index].type,
				IdAnn
			);
		});*/
		const resultsDeleteCamions = Promise.all(reqCamions).then((res) => {
			return res;
		});
		const resultsDeleteEngins = Promise.all(reqEngins).then((res) => {
			return res;
		});
		/*const resultsDeleteExcel = Promise.all(reqExel).then((res) => {
			return res;
		});*/
		res.json({
			results,
			resultsDeleteCamions,
			resultsDeleteEngins,
			//resultsDeleteExcel,
		});
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
//read camion engin xlsx
routerAnnonces.get("/readCamsxlsx", (req, res) => {
	try {
		const sheetjs = require("xlsx");
		const os = require("os");
		var fs = require("fs");
		var pathLib = require("path");
		const dirCamsXLS =
			os.userInfo().homedir +
			"\\Documents\\ZSC\\archive_excel\\tabCamionsGlobale.xlsx";
		const dirEnginsXLS =
			os.userInfo().homedir +
			"\\Documents\\ZSC\\archive_excel\\tabEnginsGlobale.xlsx";

		const sheetsObj_camions = sheetjs.readFile(dirCamsXLS);
		const sheetsObj_engins = sheetjs.readFile(dirEnginsXLS);
		const jsonObj_camions = sheetjs.utils.sheet_to_json(
			sheetsObj_camions.Sheets[sheetsObj_camions.SheetNames[0]],
			{
				Headers: [
					"Marque",
					"Model",
					"Fonction",
					"Essieux",
					"Annee",
					"KMS",
					"Motorisation",
					"BoiteVitesse",
					"Couleur",
					"etat",
					"PRIX",
					"Disponibilite",
					"departement",
					"NomSocite",
					"NUMPrtable",
					"NUMFixe",
					"commentaire",
					"nom",
					"Date",
					"Référence",
				],
			}
		);
		const jsonObj_engins = sheetjs.utils.sheet_to_json(
			sheetsObj_engins.Sheets[sheetsObj_engins.SheetNames[0]],
			{
				Headers: [
					"type",
					"MARQUE",
					"réf",
					"Heures",
					"prix",
					"année",
					"nb,godets",
					"bras",
					"num client",
					"Disponibilité",
					"Commentaire",
					"date",
					"dep",
					"nom",
				],
			}
		);
		res.json({ sheetCamions: jsonObj_camions, sheetEngins: jsonObj_engins });
	} catch (error) {
		console.log(error);
		res.send("Error");
	}
});
module.exports = routerAnnonces;
