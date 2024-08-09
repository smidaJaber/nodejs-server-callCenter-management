const pool = require("./config/dbpool");

let agentsglobales = {};
agentsglobales.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from agent", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

agentsglobales.one = (id) => {
	return new Promise((resolve, reject) => {
		pool.query("select * from agent where id = ?", [id], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results[0]);
		});
	});
};
agentsglobales.addOne = (
	nom,
	prenom,
	lastlogin,
	createdBy,
	login,
	password,
	status
) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"insert into agent SET \
            nom = ?, prenom = ?, lastlogin = ?, createdBy = ?, login = ?, \
            password = ?, status = ? ",
			[nom, prenom, lastlogin, createdBy, login, password, status],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

agentsglobales.editOne = (
	id,
	nom,
	prenom,
	lastlogin,
	createdBy,
	login,
	password,
	status
) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update agent SET id = ?, nom = ?, prenom = ?, lastlogin = ?, createdBy = ?, login = ?, \
            password = ?, status = ? where id = ?",
			[nom, prenom, lastlogin, createdBy, login, password, status, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

agentsglobales.deleteOne = (IDAgent) => {
	return new Promise((resolve, reject) => {
		pool.query("delete from agent where id= ?", [IDAgent], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};
agentsglobales.deleteMany = (IDA) => {
	return new Promise((resolve, reject) => {
		pool.query("delete from agent where id in (?)", [IDA], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

module.exports = agentsglobales;
