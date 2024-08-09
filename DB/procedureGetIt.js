var mysql = require("mysql");
var MysqlPoolBooster = require("mysql-pool-booster");
mysql = MysqlPoolBooster(mysql);
const pool = mysql.createPool({
	connectionLimit: 6,
	user: "root",
	password: "",
	host: "localhost",
	database: "acs",
});

let ReqGetIt = {};
ReqGetIt.all = (table, IDName, champ, IDValue) => {
	// return {table,IDName,champ,IDValue}
	return new Promise((resolve, reject) => {
		pool.query(
			"CALL `getit`(?, ?, ?, ?)",
			[table, IDName, champ, IDValue],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results[0][0]);
			}
		);
	});
};

module.exports = ReqGetIt;
