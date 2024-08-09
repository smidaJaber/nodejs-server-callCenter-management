const mysql = require("mysql");

const pool = mysql.createPool({
	connectionLimit: 10,
	user: "root",
	password: "",
	host: "localhost",
	database: "acs",
});

let ReqUtilisateur = {};
ReqUtilisateur.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from user where deleted = 0", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

ReqUtilisateur.one = (id) => {
	return new Promise((resolve, reject) => {
		pool.query("select * from user where IDUser = ?", [id], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results[0]);
		});
	});
};

ReqUtilisateur.addOne = (
	login,
	password,
	type,
	dateCreation,
	allowedModule,
	IdUser
) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"insert into user SET \
             login = ?, password = ?, type = ?, dateCreation = ?, allowedModule= ?, createdBy = ?",
			[login, password, type, dateCreation, allowedModule, IdUser],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

ReqUtilisateur.editOne = (
	id,
	login,
	password,
	type,
	dateCreation,
	allowedModule,
	IdUser
) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update user SET login = ?, password = ?, type = ?, dateCreation = ?, allowedModule = ?, createdBy = ? where IDUser= ?",
			[login, password, type, dateCreation, allowedModule, IdUser, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

ReqUtilisateur.deleteOne = (IDUser) => {
	return new Promise((resolve, reject) => {
		pool.query("delete from user where IDUser= ?", [IDUser], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

module.exports = ReqUtilisateur;
