const mysql = require("mysql");

const pool = mysql.createPool({
	connectionLimit: 10,
	user: "root",
	password: "",
	host: "localhost",
	database: "acs",
});

let ReqClients = {};
ReqClients.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from Client", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

ReqClients.one = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select * from client where IDClientProd = ?",
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

ReqClients.addOne = (
	nomClient,
	adressClient,
	mobile,
	fixe,
	email,
	fax,
	specialite,
	noteClient,
	RIB,
	matricule,
	statutClient,
	infoClient,
	typeClient,
	IdUser
) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"insert into client SET \
            nom = ?, adresse = ?, telMob = ?, telFix = ?, mail = ?, fax = ?, \
            specialite = ?, note = ?, RIB = ?, matricule = ?, \
            dateCreation = ?, ajouterPar = ?, statut = ?, information = ?, typeClient = ?, IDUser = ?",
			[
				nomClient,
				adressClient,
				mobile,
				fixe,
				email,
				fax,
				specialite,
				noteClient,
				RIB,
				matricule,
				"",
				1,
				statutClient,
				infoClient,
				typeClient,
				IdUser,
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

ReqClients.editOne = (
	id,
	nomClient,
	adressClient,
	mobile,
	fixe,
	email,
	fax,
	specialite,
	noteClient,
	RIB,
	matricule,
	statutClient,
	infoClient,
	typeClient,
	IdUser
) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update client SET nom = ?, adresse = ?, telMob = ?, telFix = ?, mail = ?, fax = ?, \
            specialite = ?, note = ?, RIB = ?, matricule = ?, \
            statut = ?, information = ?, typeClient = ?, IDUser = ? where IDClientProd = ?",
			[
				nomClient,
				adressClient,
				mobile,
				fixe,
				email,
				fax,
				specialite,
				noteClient,
				RIB,
				matricule,
				statutClient,
				infoClient,
				typeClient,
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

ReqClients.deleteOne = (IDClientProd) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from client where IDClientProd= ?",
			[IDClientProd],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

module.exports = ReqClients;
