const mysql = require("mysql");

const pool = mysql.createPool({
	connectionLimit: 10,
	user: "root",
	password: "",
	host: "localhost",
	database: "acs",
});

let ReqTypeDepenses = {};
ReqTypeDepenses.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from depense", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

ReqTypeDepenses.one = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select * from depense where IDTypeDepense = ?",
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

ReqTypeDepenses.addOne = (nomDepense, infoDepense, IdUser) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"insert into depense SET \
            nom = ?, information = ? , IDUser = ?",
			[nomDepense, infoDepense, IdUser],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

ReqTypeDepenses.editOne = (id, nomDepense, infoDepense, IdUser) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update depense SET nom = ?, information = ?, IDUser = ? where IDTypeDepense= ?",
			[nomDepense, infoDepense, IdUser, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

ReqTypeDepenses.deleteOne = (IDTypeDepense) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from depense where IDTypeDepense= ?",
			[IDTypeDepense],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

module.exports = ReqTypeDepenses;
