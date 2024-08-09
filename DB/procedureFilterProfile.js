const mysql = require("mysql");

const pool = mysql.createPool({
	connectionLimit: 10,
	user: "root",
	password: "",
	host: "localhost",
	database: "acs",
});

let ReqFilterProfile = {};

///oppp

ReqFilterProfile.filterCaisseOpp = (tableName, cle, id, cle2, id2, CX) => {
	// return {table,IDName,champ,IDValue}
	return new Promise((resolve, reject) => {
		pool.query(
			"CALL `filtrecaisseopp`(?,?,?,?,?,?)",
			[tableName, cle, id, cle2, id2, CX],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqFilterProfile.filterEmballageOpp = (tableName, cle, id, cle2, id2, CX) => {
	// return {table,IDName,champ,IDValue}
	return new Promise((resolve, reject) => {
		pool.query(
			"CALL `filtreembopp`(?,?,?,?,?,?)",
			[tableName, cle, id, cle2, id2, CX],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqFilterProfile.filterMaterielOpp = (tableName, cle, id, cle2, id2, CX) => {
	// return {table,IDName,champ,IDValue}
	return new Promise((resolve, reject) => {
		pool.query(
			"CALL `filtrematopp`(?,?,?,?,?,?)",
			[tableName, cle, id, cle2, id2, CX],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

ReqFilterProfile.filterMontantOpp = (
	tableName,
	cle,
	id,
	cle2,
	id2,
	typ,
	CX
) => {
	// return {table,IDName,champ,IDValue}
	return new Promise((resolve, reject) => {
		pool.query(
			"CALL `filtremontanttableopp`(?,?,?,?,?,?,?)",
			[tableName, cle, id, cle2, id2, typ, CX],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

//ressources
ReqFilterProfile.filterCaisse = (tableName, cle, id, cle2, id2, CX) => {
	// return {table,IDName,champ,IDValue}
	return new Promise((resolve, reject) => {
		pool.query(
			"CALL `filtrecaisseress`(?,?,?,?,?,?)",
			[tableName, cle, id, cle2, id2, CX],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqFilterProfile.filterEmballage = (tableName, cle, id, cle2, id2, CX) => {
	// return {table,IDName,champ,IDValue}
	return new Promise((resolve, reject) => {
		pool.query(
			"CALL `filtreembress`(?,?,?,?,?,?)",
			[tableName, cle, id, cle2, id2, CX],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqFilterProfile.filterMateriel = (tableName, cle, id, cle2, id2, CX) => {
	// return {table,IDName,champ,IDValue}
	return new Promise((resolve, reject) => {
		pool.query(
			"CALL `filtrematress`(?,?,?,?,?,?)",
			[tableName, cle, id, cle2, id2, CX],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqFilterProfile.filterMontant = (tableName, cle, id, cle2, id2, CX) => {
	// return {table,IDName,champ,IDValue}
	return new Promise((resolve, reject) => {
		pool.query(
			"CALL `filtremontanttableress`(?,?,?,?,?,?)",
			[tableName, cle, id, cle2, id2, CX],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

module.exports = ReqFilterProfile;
