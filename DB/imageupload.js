const pool = require("./config/dbpool");

let imagesupload = {};
imagesupload.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from cblobs", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};
imagesupload.insertImage = (img, idAnnonce) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"INSERT INTO cblobs set image=?, idAnnonce=?",
			[img, idAnnonce],
			function (err, res) {
				if (err) {
					return reject(err);
				}
				return resolve(res);
			}
		);
	});
};
imagesupload.getImage = (idAnnonce) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select * from cblobs where idAnnonce=?",
			[idAnnonce],
			function (err, res) {
				if (err) {
					return reject(err);
				}
				//const row = res[0];
				// Got BLOB data:
				//const data = row.data;
				// Converted to Buffer:
				//const buf = new Buffer(data, "binary");
				return resolve(res);
			}
		);
	});
};
imagesupload.deleteImage = (idImg) => {
	return new Promise((resolve, reject) => {
		pool.query("delete from cblobs where id=?", [idImg], function (err, res) {
			if (err) {
				return reject(err);
			}
			//const row = res[0];
			// Got BLOB data:
			//const data = row.data;
			// Converted to Buffer:
			//const buf = new Buffer(data, "binary");
			return resolve(res);
		});
	});
};
imagesupload.deleteImagesByIdAnnonce = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"delete from cblobs where idAnnonce=?",
			[id],
			function (err, res) {
				if (err) {
					return reject(err);
				}
				//const row = res[0];
				// Got BLOB data:
				//const data = row.data;
				// Converted to Buffer:
				//const buf = new Buffer(data, "binary");
				return resolve(res);
			}
		);
	});
};

module.exports = imagesupload;
