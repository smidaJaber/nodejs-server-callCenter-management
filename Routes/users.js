const express = require("express");
const DB = require("../DB");
const routerUser = express.Router();
const Moment = require("moment");
const mysql = require("mysql");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { WebSocket } = require("ws");
const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "consuzs",
	multipleStatements: true,
});
var del = connection._protocol._delegateError;
connection._protocol._delegateError = function (err, sequence) {
	if (err.fatal) {
		console.trace("fatal error: " + err.message);
	}
	return del.call(this, err, sequence);
};

const customFields = {
	usernameField: "uname",
	passwordField: "pw",
};
/*Passport JS*/
const verifyCallback = (username, password, done, req, res) => {
	connection.query(
		"SELECT * FROM user WHERE username = ? and password= ?",
		[username, password],
		function (error, results, fields) {
			if (error) return done(error);

			if (results.length == 0) {
				return done(null, false);
			}
			const isValid = true; // validPassword(password, results[0].hash, results[0].salt);
			let user = {
				id: results[0].id,
				username: results[0].username,
				status: results[0].status,
				role: results[0].role,
				firstName: results[0].firstName,
				lastName: results[0].lastName,
			};
			if (isValid) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		}
	);
};

const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(function (userId, done) {
	connection.query(
		"SELECT * FROM user where id = ?",
		[userId],
		function (error, results) {
			done(null, results[0]);
		}
	);
});
/*middleware login managment*/
function validPassword(password, hash, salt) {
	/*var hashVerify = crypto
		.pbkdf2Sync(password, salt, 10000, 60, "sha512")
		.toString("hex");
	return hash === hashVerify;*/
}

function genPassword(password) {
	/*var salt = crypto.randomBytes(32).toString("hex");
	var genhash = crypto
		.pbkdf2Sync(password, salt, 10000, 60, "sha512")
		.toString("hex");
	return { salt: salt, hash: genhash };*/
}

function isAuth(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/notAuthorized");
	}
}

function isAdmin(req, res, next) {
	if (req.isAuthenticated() && req.user.role == "admin") {
		next();
	} else {
		res.redirect("/notAuthorizedAdmin");
	}
}

function userExists(req, res, next) {
	connection.query(
		"Select * from user where username=? ",
		[req.body.uname],
		function (error, results, fields) {
			if (error) {
				console.log("Error");
			} else if (results.length > 0) {
				res.redirect("/userAlreadyExists");
			} else {
				next();
			}
		}
	);
}
///methode identification
function annonceMiddleWare(req, res, next) {
	//console.log(["PUT", "POST", "DELETE"].includes(req.method));
	//force update
	console.log(req.session);
	console.log(req.user);
	next();
}

routerUser.get("/logout", async (req, res, next) => {
	let resultsLastLogOut = await DB.users.setLastLogout(
		Moment().format("YYYY-MM-DD HH:mm"),
		req.user.id
	);

	var io = req.app.get("socketio");
	io.clients.forEach(function each(client) {
		if (client !== io && client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					senderId: req.user.id,
					type: "FromAPI",
					data:
						req.user.firstName + " " + req.user.lastName + " s'est déconnecté",
				}),
				{ binary: false }
			);
		}
	});

	req.logout(); //delets the user from the session
	res.json({ error: false, message: "Déconnexion terminé avec succès" });
});
routerUser.post("/login", passport.authenticate("local"), async (req, res) => {
	let resultsLastLogin = await DB.users.setLastLogin(
		Moment().format("YYYY-MM-DD HH:mm"),
		req.user.id
	);
	var io = req.app.get("socketio");

	io.clients.forEach(function each(client) {
		if (client !== io && client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({
					senderId: req.user.id,
					type: "FromAPI",
					data: req.user.firstName + " " + req.user.lastName + " est en ligne",
				}),
				{ binary: false }
			);
		}
	});

	res.send({ error: false, message: "Connexion avec succès" });
});
routerUser.get("/loggeduser/", (req, res) => {
	res.json({ user: req.user ? req.user : false, session: req.session });
});
routerUser.get("/login-success", (req, res, next) => {
	console.log(req.user);
	res.send(
		'<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
	);
});

routerUser.get("/login-failure", (req, res, next) => {
	res.send("You entered the wrong password.");
});

routerUser.post("/connexion", async function (req, res, next) {
	try {
		let checkResult = await DB.users.checklogin(req.body.password);
		if (checkResult.length > 0) {
			let results = await DB.users.connexion(1);
			res.json(results);
		} else {
			res.json({ error: true });
		}
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
//afficher tous
routerUser.get("/users", async (req, res, next) => {
	try {
		let results = await DB.users.all();
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerUser.get("/users/sinfos", async (req, res, next) => {
	try {
		let results = await DB.users.allSInfos();
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerUser.get("/deconnexion/", async (req, res, next) => {
	try {
		let results = await DB.users.deconnexion(0);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerUser.get("/users/lockuser/:id", async (req, res, next) => {
	try {
		let results = await DB.users.lockUser(req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerUser.get("/users/unlockuser/:id", async (req, res, next) => {
	try {
		let results = await DB.users.unlockUser(req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerUser.get("/users/settheme/:id/:theme", async (req, res, next) => {
	try {
		let results = await DB.users.setTheme(req.params.theme, req.params.id);
		req.session.passport.user.theme = req.params.theme;
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//affichage / recherche by id
routerUser.get("/users/:id", async (req, res, next) => {
	try {
		let results = await DB.users.one(req.params.id);
		res.json(results || { error: "ID introuvable" });
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
//get all droits - access module liste names
routerUser.get("/users/listeDroit/All", async (req, res, next) => {
	try {
		const CODES = process.env.ALL_ACCESS_LISTE_CODE.split(",");
		const TXT = process.env.ALL_ACCESS_LISTE_TXT.split(",");
		const AdminAccess = process.env.ALL_ACCESS_LISTE_CODE_ADMIN.split(",");
		let results = [];
		CODES.forEach((code, i) => {
			results.push({
				code: code,
				txt: TXT[i],
				adminAccess: parseInt(AdminAccess[i]),
			});
		});

		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
//affichage /  se conencter
routerUser.post("/users/connect/", async (req, res, next) => {
	try {
		passport.authenticate("local", function (err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.json({
					status: "error",
					message:
						typeof info !== "undefined"
							? info.message
							: "Login ou mot de passe incorrect",
					canConnect: false,
					raison: "Login ou mot de passe incorrect",
					id: user.IDUser,
				});
			}
			req.logIn(user, async function (err) {
				if (err) {
					return next(err);
				}
				try {
					let resultsSuper = await DB.users.superData(user.IDUser);
					let resultsAd = await DB.users.adminData(user.IDUser);
					let resultConenctedUser = await DB.users.userData(user.IDUser);
					let superAdminConnected = resultsSuper ? resultsSuper.isConnected : 0;
					let adminCOnencted = resultsAd ? resultsAd.isConnected : 0;
					let userConnectedTYPE = resultConenctedUser
						? resultConenctedUser.type
						: "";
					let isLocked = resultConenctedUser
						? parseInt(resultConenctedUser.locked)
						: 0;

					if (isLocked === 1) {
						return res.send({
							canConnect: false,
							raison: "Compte verouillé",
							id: user.IDUser,
							type: user.type,
						});
					}

					if (superAdminConnected) {
						return res.send({
							canConnect: false,
							raison: "Superviseur connecté.",
							id: user.IDUser,
							type: user.type,
						});
					}
					if (
						!adminCOnencted &&
						userConnectedTYPE !== "superAdmin" &&
						userConnectedTYPE !== "admin"
					) {
						return res.send({
							canConnect: false,
							raison: "Admin déconnecté.",
							id: user.IDUser,
							type: user.type,
						});
					}
					await DB.users.setConnected(1, user.IDUser);
					return res.json({ status: "ok", id: user.IDUser, type: user.type });
				} catch (error) {
					console.log(error);
				}
			});
		})(req, res, next);
		/* let results = await DB.users.connect(req.body.login, req.body.password);
		res.json(results || { error: "utilisateur introuvable" }); */
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//logout
routerUser.get("/users/isConnected", async (req, res, next) => {
	console.log("called");
});

//ajout
routerUser.post("/users", async (req, res, next) => {
	try {
		let results = await DB.users.addOne(
			req.body.createdAt,
			req.body.firstName,
			req.body.lastName,
			req.body.password,
			req.body.role,
			req.body.updatedAt,
			req.body.username,
			req.body.status
		);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//edit
routerUser.put("/users/:id", async (req, res, next) => {
	try {
		let results = await DB.users.editOne(req.body.password);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//edit
routerUser.put("/users/lastLogin/:id", async (req, res, next) => {
	try {
		let results = await DB.users.setLastLogin(Moment(), req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
//delete
routerUser.put("/users/setDeleted/:id", async (req, res, next) => {
	try {
		let results = await DB.users.deleteOne(req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
module.exports = routerUser;
