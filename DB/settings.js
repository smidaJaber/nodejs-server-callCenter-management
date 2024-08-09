const pool = require("./config/dbpool");

let ReqSettings = {};
ReqSettings.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from settings", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results[0]);
		});
	});
};

ReqSettings.editCamionPath = (id, path) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update settings SET \
			camionPath = ? where id= ?",
			[path, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqSettings.editEnginPath = (id, path) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update settings SET \
			enginPath = ? where id= ?",
			[path, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqSettings.editAgentPath = (id, path) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update settings SET \
			agentPath = ? where id= ?",
			[path, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

module.exports = ReqSettings;
