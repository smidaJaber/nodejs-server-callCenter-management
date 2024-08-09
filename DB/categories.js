const pool = require("./config/dbpool");

let categories = {};
categories.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from categorie", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

categories.one = (id) => {
	return new Promise((resolve, reject) => {
		pool.query("select * from categorie where id = ?", [id], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results[0]);
		});
	});
};

categories.addOne = (nom) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"insert into categorie SET \
            nom= ?  ",
			[nom],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

categories.editOne = (nom, id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update categorie SET   nom= ?, where id = ?",
			[nom, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

categories.deleteOne = (IDCamion) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from categorie where id= ?",
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
categories.deleteMany = (IDCamion) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from categorie where id in (?)",
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
categories.deleteByAnnonce = (IDCamion) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from categorie where id = ?",
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

module.exports = categories;
