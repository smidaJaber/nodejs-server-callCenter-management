const pool = require("./config/dbpool");

let camionsglobales = {};
camionsglobales.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from tabcamionsglobale", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

camionsglobales.one = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select * from tabcamionsglobale where id = ?",
			[id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results[0]);
			}
		);
	});
};
camionsglobales.oneByAnnonce = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select * from tabcamionsglobale where id_annonce = ?",
			[id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results[0]);
			}
		);
	});
};

camionsglobales.addOne = (
	date,
	dPartement,
	marque,
	modL,
	fonction,
	boiteDeVitesse,
	kms,
	annE,
	couleur,
	commentaire,
	options,
	essieux,
	etat,
	etatCarrosserie,
	susAvant,
	susArriere,
	prix,
	coordVendeur,
	id,
	subCateg,
	idAnnonce,
	ref
) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"insert into tabcamionsglobale SET \
            annE = ?, boiteDeVitesse = ?, commentaire = ?, couleur = ?, date = ?, \
            dPartement = ?, essieux = ?, etat = ?, \
            fonction = ?,  kms = ?, marque = ?, modL = ?, prix = ?, options= ?, etatCarrosserie= ?, susAvant= ?, \
            susArriere= ?, coordVendeur= ?,subCateg= ?, id_annonce= ?, ref= ? ",
			[
				annE,
				boiteDeVitesse,
				commentaire,
				couleur,
				date,
				dPartement,
				essieux,
				etat,
				fonction,
				kms,
				marque,
				modL,
				prix,
				options,
				etatCarrosserie,
				susAvant,
				susArriere,
				coordVendeur,
				subCateg,
				idAnnonce,
				ref,
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

camionsglobales.editOne = (
	date,
	dPartement,
	marque,
	modL,
	fonction,
	boiteDeVitesse,
	kms,
	annE,
	couleur,
	commentaire,
	options,
	essieux,
	etat,
	etatCarrosserie,
	susAvant,
	susArriere,
	prix,
	coordVendeur,
	id,
	subCateg,
	idAnnonce
) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update tabcamionsglobale SET annE = ?, boiteDeVitesse = ?, commentaire = ?, couleur = ?, date = ?, \
            dPartement = ?, essieux = ?, etat = ?, \
            fonction = ?,  kms = ?, marque = ?, modL = ?, prix = ?, options= ?, etatCarrosserie= ?, susAvant= ?, \
            susArriere= ?, coordVendeur= ?, id_annonce = ?,subCateg= ? where id = ?",
			[
				annE,
				boiteDeVitesse,
				commentaire,
				couleur,
				date,
				dPartement,
				essieux,
				etat,
				fonction,
				kms,
				marque,
				modL,
				prix,
				options,
				etatCarrosserie,
				susAvant,
				susArriere,
				coordVendeur,
				idAnnonce,
				subCateg,
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

camionsglobales.deleteOne = (IDCamion) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from tabcamionsglobale where id= ?",
			[IDCamion],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
camionsglobales.deleteMany = (IDCamion) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from tabcamionsglobale where id_annonce in (?)",
			[IDCamion],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
camionsglobales.deleteByAnnonce = (IDAnn) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from tabcamionsglobale where id_annonce = ?",
			[IDAnn],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

module.exports = camionsglobales;
