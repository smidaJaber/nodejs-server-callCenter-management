const mysql = require("mysql");

const pool = mysql.createPool({
	connectionLimit: 10,
	user: "root",
	password: "",
	host: "localhost",
	database: "acs",
});

let ReqCaisses = {};
ReqCaisses.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from caisse", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

ReqCaisses.one = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select * from caisse where IDCaisse = ?",
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

ReqCaisses.addOne = (nomCaisse, poidCaisse, infoCaisse) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"insert into caisse SET \
             nom = ?, poid=?, information=?",
			[nomCaisse, poidCaisse, infoCaisse],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

ReqCaisses.editOne = (id, nomCaisse, poidCaisse, infoCaisse) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update caisse SET nom = ?, poid=?, information=? where IDCaisse= ?",
			[nomCaisse, poidCaisse, infoCaisse, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

ReqCaisses.deleteOne = (IDCaisse) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from caisse where IDCaisse= ?",
			[IDCaisse],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

module.exports = ReqCaisses;
