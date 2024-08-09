const mysql = require("mysql");

const pool = mysql.createPool({
	connectionLimit: 10,
	user: "root",
	password: "",
	host: "localhost",
	database: "acs",
});

let ReqNotification = {};
ReqNotification.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from equipement", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

ReqNotification.one = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select * from equipement where IDEquip = ?",
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

ReqNotification.editOne = (
	id,
	nom,
	periodeRevision,
	statut,
	IDBon,
	infoEquipement,
	dateMiseEnService,
	dateControl,
	IdUser
) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update equipement SET \
			nom = ?, periodeRevision = ?, statut = ?, IDBon = ?, \
			information = ?, dateMiseEnService = ?, dateControl = ?, IDUser = ? where IDEquip = ?",
			[
				nom,
				periodeRevision,
				statut,
				IDBon,
				infoEquipement,
				dateMiseEnService,
				dateControl,
				IdUser,
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

module.exports = ReqNotification;
