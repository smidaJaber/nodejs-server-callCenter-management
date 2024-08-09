const pool = require("./config/dbpool");

let ReqUsers = {};
ReqUsers.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from user", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};
ReqUsers.allSInfos = () => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select IDUser,login,type,isConnected,locked,lastLogin,createdBy from user where deleted = 0",
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqUsers.deconnexion = (value) => {
	return new Promise((resolve, reject) => {
		pool.query("update user set isConnected=? ", [value], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};
ReqUsers.connexion = (value) => {
	return new Promise((resolve, reject) => {
		pool.query("update user set isConnected=? ", [value], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};
ReqUsers.checklogin = (value) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select * from user where password=? ",
			[value],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqUsers.lockUser = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update user set locked=? where IDUser = ?",
			[1, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqUsers.unlockUser = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update user set locked=? where IDUser = ?",
			[0, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqUsers.setTheme = (theme, id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update user set theme=? where IDUser = ?",
			[theme, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqUsers.connect = (login, password) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select * from user where login = ? and password = ?",
			[login, password],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results[0]);
			}
		);
	});
};

ReqUsers.one = (id) => {
	return new Promise((resolve, reject) => {
		pool.query("select * from user where id = ?", [id], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results[0]);
		});
	});
};
ReqUsers.oneIsConnected = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select isConnected from user where IDUser = ?",
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
ReqUsers.superData = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select type,isConnected from user where type = 'superAdmin'",
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
ReqUsers.adminData = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select type,isConnected,locked from user where type = 'admin'",
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
ReqUsers.userData = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"select type,isConnected,locked from user where IDUser = ?",
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

ReqUsers.addOne = (
	createdAt,
	firstName,
	lastName,
	password,
	role,
	updatedAt,
	username,
	status
) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"insert into user SET \
             createdAt = ?, firstName = ?, lastName = ?,password=?, roles=?, updatedAt = ?, username = ?, status = ?",
			[
				createdAt,
				firstName,
				lastName,
				password,
				role,
				updatedAt,
				username,
				status,
			],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

ReqUsers.editOne = (password) => {
	return new Promise((resolve, reject) => {
		pool.query("update user SET password=?", [password], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};
ReqUsers.setLastLogin = (lastlog, id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update user SET lastLogIn = ?, lastLogOut = '' where id= ?",
			[lastlog, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqUsers.setLastLogout = (lastlog, id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update user SET lastLogOut = ? where id= ?",
			[lastlog, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqUsers.lockAccount = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update user SET locked = 1 where IDUser= ?",
			[id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqUsers.unlockAccount = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update user SET locked = 0 where IDUser= ?",
			[id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqUsers.upAttempts = (n, id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update user SET nbrAttempts = ? where IDUser= ?",
			[n, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqUsers.setConnected = (n, id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update user SET isConnected = ? where IDUser= ?",
			[n, id],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};
ReqUsers.getValueOFChamp = (ch, id) => {
	const reqByChamp = "select " + ch + " from user where IDUser= ?";
	return new Promise((resolve, reject) => {
		pool.query(reqByChamp, [ch, id], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

ReqUsers.deleteOne = (IDUser) => {
	return new Promise((resolve, reject) => {
		pool.query(
			"update user SET deleted = ? where IDUser= ?",
			[1, IDUser],
			(err, results) => {
				if (err) {
					return reject(err);
				}
				return resolve(results);
			}
		);
	});
};

module.exports = ReqUsers;
