const pool = require("./config/dbpool");
const moment = require("moment");
let annonces = {};

annonces.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from annonce order by id DESC", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

annonces.one = (id) => {
	return new Promise((resolve, reject) => {
		pool.query("select * from annonce where id = ?", [id], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results[0]);
		});
	});
};
annonces.writeToExcel = (file, data, refAnnonce, agentObj) => {
	var Excel = require("exceljs");
	var workbook = new Excel.Workbook();
	const annonce = data;
	const Engin = data.engin;
	const Camion = data.camion;
	const isCamion = data.typeOfArticle === "C";
	return new Promise(async (resolve, reject) => {
		await workbook.xlsx.readFile(file);

		var worksheet = workbook.worksheets[0];

		/*//#region hedaerexcel
		worksheet.columns = isCamion
			? [
					{ header: "Marque", key: "Marque" },
					{ header: "Model", key: "Model" },
					{ header: "Fonction", key: "Fonction" },
					{ header: "Essieux", key: "Essieux" },
					{ header: "Annee", key: "Annee" },
					{ header: "KMS", key: "KMS" },
					{ header: "Motorisation", key: "Motorisation" },
					{ header: "BoiteVitesse", key: "BoiteVitesse" },
					{ header: "Couleur", key: "Couleur" },
					{ header: "etat", key: "etat" },
					{ header: "PRIX", key: "PRIX" },
					{ header: "Disponibilite", key: "Disponibilite" },
					{ header: "departement", key: "departement" },
					{ header: "NomSocite", key: "NomSocite" },
					{ header: "NUMPrtable", key: "NUMPrtable" },
					{ header: "NUMFixe", key: "NUMFixe" },
					{ header: "commentaire", key: "commentaire" },
					{ header: "nom", key: "nom" },
					{ header: "Date", key: "Date" },
			  ]
			: [];
		#endregion */
		var row = isCamion
			? {
					Marque: Camion.marque,
					Model: Camion.modL,
					Fonction: Camion.fonction,
					Essieux: Camion.essieux,
					Annee: Camion.annE,
					KMS: Camion.kms,
					Motorisation: "---",
					BoiteVitesse: Camion.boiteDeVitesse,
					Couleur: Camion.couleur,
					etat: Camion.etat,
					PRIX: Camion.prix,
					Disponibilite: "---",
					departement: Camion.dPartement,
					NomSocite: Camion.coordVendeur.nom,
					NUMPrtable: Camion.coordVendeur.tel,
					NUMFixe: Camion.coordVendeur.tel,
					commentaire: Object.entries(Camion.options)
						.filter((opt) => opt[1] === true)
						.map((option) => option[0])
						.toString()
						.split(",")
						.join("/"),
					nom: agentObj
						? agentObj.firstName + " " + agentObj.lastName
						: "agent non défini",
					Date: Camion.date,
					ref: refAnnonce,
			  }
			: {};
		let reqResults;
		let rowArray = Object.values(row);
		let lastRow = worksheet.lastRow.number;

		reqResults = worksheet.getRow(lastRow + 1).values = rowArray;
		/*
		worksheet.getRow(lastRow + 1).getCell(6).fill = {
			type: "pattern",
			pattern: "solid",
			bgColor: { rgb: row.KMS > 14000 ? "#4040FF" : "#55BB33" },
		};
		*/
		workbook.xlsx
			.writeFile(file)
			.then((res) => {
				return resolve(res);
			})
			.catch((err) => {
				console.log(err);
				return reject(err);
			});
	});
};
annonces.deleteRowExcel = (file, data, idAnnonce) => {
	var Excel = require("exceljs");
	var workbook = new Excel.Workbook();
	var ref = idAnnonce.toString().padStart(4, "0");
	const isCamion = data === "C";
	const refAnnonce = idAnnonce.toString().padStart(4, "0");
	return new Promise(async (resolve, reject) => {
		await workbook.xlsx.readFile(file);
		var worksheet = workbook.worksheets[0];
		worksheet.eachRow((row, index) => {
			var cell = isCamion ? row.getCell(20).toString() : "";
			console.log(
				ref,
				cell.split("/")[1],
				isCamion ? "c" : "E",
				"=> deleted ? ",
				cell.split("/")[1] === ref
			);
			if (cell.split("/")[1] === ref) {
				worksheet.spliceRows(index, 1);
				//row.splice(index, 1);
				//row.commit();

				return resolve();
			}
		});

		workbook.xlsx
			.writeFile(file)
			.then((res) => {
				return resolve(res);
			})
			.catch((err) => {
				console.log(err);
				return reject(err);
			});
	});
};
annonces.editExcel = (file, data, refAnnonce, agentObj) => {
	console.log(agentObj);
	var Excel = require("exceljs");
	var workbook = new Excel.Workbook();
	const annonce = data;
	const Engin = data.engin;
	const Camion = data.camion;
	const isCamion = data.typeOfArticle === "C";
	return new Promise(async (resolve, reject) => {
		await workbook.xlsx.readFile(file);

		var worksheet = workbook.worksheets[0];
		var row = isCamion
			? {
					Marque: Camion.marque,
					Model: Camion.modL,
					Fonction: Camion.fonction,
					Essieux: Camion.essieux,
					Annee: parseInt(Camion.annE, 10),
					KMS: parseInt(Camion.kms, 10),
					Motorisation: "---",
					BoiteVitesse: Camion.boiteDeVitesse,
					Couleur: Camion.couleur,
					etat: Camion.etat,
					PRIX: parseInt(Camion.prix, 10),
					Disponibilite: "---",
					departement: Camion.dPartement,
					NomSocite: Camion.coordVendeur.nom,
					NUMPrtable: Camion.coordVendeur.tel,
					NUMFixe: Camion.coordVendeur.tel,
					commentaire: Object.entries(Camion.options)
						.filter((opt) => opt[1] === true)
						.map((option) => option[0])
						.toString()
						.split(",")
						.join("/"),
					nom: agentObj
						? agentObj.firstName + " " + agentObj.lastName
						: "agent non défini",
					Date: Camion.date,
					ref: Camion.ref,
			  }
			: {};
		let reqResults;
		let rowArray = Object.values(row);
		let wantedRow;
		worksheet.eachRow(function (row, rowNumber) {
			if (row.getCell(20).toString() === Camion.ref) {
				wantedRow = worksheet.getRow(rowNumber);
			}
		});
		reqResults = wantedRow ? (wantedRow.values = rowArray) : "Error";
		/*
		worksheet.getRow(lastRow + 1).getCell(6).fill = {
			type: "pattern",
			pattern: "solid",
			bgColor: { rgb: row.KMS > 14000 ? "#4040FF" : "#55BB33" },
		};
		*/
		workbook.xlsx
			.writeFile(file)
			.then((res) => {
				return resolve(res);
			})
			.catch((err) => {
				console.log(err);
				return reject(err);
			});
	});
};
annonces.addOne = (
	title,
	createdBy,
	revisedBy,
	description,
	images,
	ref,
	createdAt,
	views,
	id_cam_engin,
	status,
	idCateg,
	idSubCateg
) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"insert into annonce SET \
            title = ?, createdBy = ?, revisedBy = ?, description = ?, images = ?, \
            ref = ?, createdAt = ?, views = ?, id_cam_engin = ?, status = ?, idCateg = ?, idSubCateg = ?",
			[
				title,
				createdBy,
				revisedBy,
				description,
				images,
				ref,
				createdAt,
				views,
				id_cam_engin,
				status,
				idCateg,
				idSubCateg,
			],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

annonces.editOne = (
	id,
	title,
	createdBy,
	revisedBy,
	description,
	images,
	ref,
	createdAt,
	updatedAt,
	views,
	id_cam_engin,
	status,
	idCateg,
	idSubCateg
) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update annonce SET title = ?, createdBy = ?, revisedBy = ?, description = ?, images = ?, \
            ref = ?, createdAt = ?, updatedAt = ?, views = ?, id_cam_engin = ?, status = ?, idCateg = ?, idSubCateg = ? where id = ?",
			[
				title,
				createdBy,
				revisedBy,
				description,
				images,
				ref,
				createdAt,
				updatedAt,
				views,
				id_cam_engin,
				status,
				idCateg,
				idSubCateg,
				id,
			],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

annonces.deleteOne = (IDAnnonce) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from annonce where id= ?",
			[IDAnnonce],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
annonces.deleteMany = (liste) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from annonce where id in (?)",
			[liste],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

module.exports = annonces;
