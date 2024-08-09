const pool = require("./config/dbpool");

let subcategories = {};
subcategories.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from souscategorie", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

subcategories.one = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select * from souscategorie where id = ?",
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

subcategories.addOne = (idParent, nom) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"insert into souscategorie SET \
            id_parent_cat= ?, nom= ? ",
			[idParent, nom],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

subcategories.editOne = (idParent, nom, id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update souscategorie SET id_parent_cat= ?, nom= ?, where id = ?",
			[idParent, nom, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

subcategories.deleteOne = (IDCamion) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from souscategorie where id= ?",
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
subcategories.deleteMany = (IDCamion) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from souscategorie where id in (?)",
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
subcategories.deleteByAnnonce = (IDCamion) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from souscategorie where id = ?",
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

module.exports = subcategories;
