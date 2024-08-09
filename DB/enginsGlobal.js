const pool = require("./config/dbpool");

let enginsglobales = {};
enginsglobales.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from tabenginsglobale", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

enginsglobales.one = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select * from tabenginsglobale where id = ?",
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
enginsglobales.oneByIdAnnonce = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select * from tabenginsglobale where id_annonce = ?",
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

enginsglobales.addOne = (
	date,
	dPartement,
	marque,
	ref,
	nbrHeur,
	nbrGodet,
	fissureSoudure,
	disponibilite,
	typeBras,
	peiture,
	etatChinile,
	prix,
	commentaire,
	coordVendeur,
	subCateg,
	id,
	idAnnonce
) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"insert into tabenginsglobale SET \
             MARQUE = ?, réf = ?, heures = ?, prix = ?, \
            nb_godets = ?, bras = ?, disponibilite = ?, \
            commentaire = ?, date = ?, dep = ?, fissure= ?, peinture= ?, etatChinile= ?, coordVendeur= ?, subCateg= ?, id_annonce = ? ",
			[
				marque,
				ref,
				nbrHeur,
				prix,
				nbrGodet,
				typeBras,
				disponibilite,
				commentaire,
				date,
				dPartement,
				fissureSoudure,
				peiture,
				etatChinile,
				coordVendeur,
				subCateg,
				idAnnonce,
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

enginsglobales.editOne = (
	date,
	dPartement,
	marque,
	ref,
	nbrHeur,
	nbrGodet,
	fissureSoudure,
	disponibilite,
	typeBras,
	peiture,
	etatChinile,
	prix,
	commentaire,
	coordVendeur,
	subCateg,
	id,
	idAnnonce
) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update tabenginsglobale SET \
            MARQUE = ?, réf = ?, heures = ?, prix = ?, \
            nb_godets = ?, bras = ?, disponibilite = ?, \
            commentaire = ?, date = ?, dep = ?, fissure= ?, peinture= ?, \
			etatChinile= ?, coordVendeur= ?, subCateg= ?, id_annonce = ? WHERE id= ?",
			[
				marque,
				ref,
				nbrHeur,
				prix,
				nbrGodet,
				typeBras,
				disponibilite,
				commentaire,
				date,
				dPartement,
				fissureSoudure,
				peiture,
				etatChinile,
				coordVendeur,
				subCateg,
				idAnnonce,
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

enginsglobales.deleteOne = (IDEngin) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from tabenginsglobale where id= ?",
			[IDEngin],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
enginsglobales.deleteMany = (IDEngin) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from tabenginsglobale where id_annonce in (?)",
			[IDEngin],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
enginsglobales.deleteByAnnonce = (IDAnn) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from tabenginsglobale where id_annonce = ?",
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

module.exports = enginsglobales;
