var ncp = require("ncp").ncp;
var rimraf = require("rimraf");

//var printer = require("node-foxit-print").print;

const { exec } = require("child_process");

const open = require("open");

const express = require("express");
const DB = require("../DB");
const fs = require("fs");
//download
var http = require("http");
//preview convert to pdf
const archiver = require("archiver");
const extractor = require("extract-zip");

const pathLib = require("path");
var ping = require("ping");
const routerfilesanddirs = express.Router();

var walker = require("walker");

routerfilesanddirs.post(
	"/filesanddirs/preparecompress/",
	async (req, res, next) => {
		try {
			const compressFilename = req.body.fname + ".zip";
			const LOCA = req.body.loca.split(" ").join("_");
			const SAIS = req.body.saison.split(" ").join("_");
			const CompFrom = process.env.GLOBAL_ARCHIVE + "/" + LOCA + "/";

			const output = fs.createWriteStream(
				process.env.COMPRESSED_WORK_TOSERVER + "/" + compressFilename
			);

			const archive = archiver("zip", {
				zlib: { level: 9 },
			});
			archive.pipe(output);

			output.on("close", function () {
				/*
				const fichierReelOUT = fs.readFileSync(
					process.env.COMPRESSED_WORK_TOSERVER + "/" + compressFilename,
					{ encoding: "base64" }
				);
				res.setHeader(
					"Content-disposition",
					"attachment; filename=" + compressFilename
				);
			
				res.download(
					process.env.COMPRESSED_WORK_TOSERVER + "/" + compressFilename,
					compressFilename
				);*/

				res.send({
					output: process.env.COMPRESSED_WORK_TOSERVER + "/" + compressFilename,
					headers: {
						MsgText: {
							taille: (archive.pointer() / 1874576).toFixed(2) + " Mo",
							msg: "Archive terminé et fermé avec succés.",
							done: true,
							output: compressFilename,
							chemin:
								process.env.COMPRESSED_WORK_TOSERVER + "/" + compressFilename,
						},
					},
				});

				console.log(archive.pointer() + " total bytes");
				console.log(
					"archiver has been finalized and the output file descriptor has closed."
				);
			});
			archive.on("error", function (err) {
				res.send({
					taille: archive.pointer() + " total bytes",
					msg: "Erreur compression de l'archive :" + err,
					done: false,
					output: compressFilename,
				});
				throw err;
			});
			archive.directory(CompFrom, LOCA);
			/*
			archive.append(process.env.DOSSIER_IMPRESSION)
			*/

			archive.finalize();
		} catch (error) {
			console.log(error);
		}
	}
);
routerfilesanddirs.post("/receiver", async (req, res, next) => {
	try {
		console.log("Receiving files..");
		/*
    if (typeof req.body.data === "undefined") {
      return res.send({
        name: "",
        ok: true,
        done: true,
        msg: "Operation terminé",
      });
    }
    */
		//const myFile = new Buffer.from(req.body.data, "base64");

		let filename = req.body.filename;
		const myFile = req.files.data;

		let destination = process.env.COMPRESSED_WORK_FROMCLIENT + "/" + filename;
		const dirPath = process.env.COMPRESSED_WORK_FROMCLIENT;
		if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()) {
			myFile.mv(destination, function (err) {
				if (err) {
					console.log(err);
					return res.status(500).send({
						msg: "Error occured when uploading compressed work to server...",
					});
				}
				// returing the response with file path and name
				// return res.send({ name: filename });
				console.log("Sending work to server ended successfully !");
				return res.send({
					name: filename,
					ok: true,
					msg: "Envoi terminé avec succés.",
				});
			});
		} else {
			fs.mkdirSync(destination, { recursive: true }, function (err) {
				if (err) {
					return err;
				} else {
					myFile.mv(dirPath, function (err) {
						if (err) {
							console.log(err);
							return res.status(500).send({
								msg: "Error occured when uploading compressed work to server:: Create folder of myClientsWork...",
							});
						}
						// returing the response with file path and name
						// return res.send({ name: filename });
						console.log(
							"Creating folder of ::myClientsWork:: done successfully !"
						);
						console.log("Sending work to server ended successfully !");
						return res.send({
							name: filename,
							ok: true,
							msg: "Envoi terminé avec succés.",
						});
					});

					// returing the response with file path and name
				}
			});
		}
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerfilesanddirs.post("/installclientwork/", async (req, res, next) => {
	try {
		console.log("installing update local.." + req.body.source);
		const source = req.body.source;
		const target = process.env.GLOBAL_ARCHIVE;
		let results = await extractor(source, {
			dir: pathLib.resolve(target),
		});
		res.send({
			data: {
				result: results,
				done: true,
				msg: "Extraction terminé avec succés",
			},
		});
		console.log("Extraction complete");
	} catch (error) {
		console.log(error);
		res.send({ result: [], done: false, msg: "Extraction échoué" });
	}
});
routerfilesanddirs.post("/filesanddirs/checkserver", async (req, res, next) => {
	try {
		console.log("verification du cnx au serveur ...");
		var host = req.body.host;

		let results = await ping.promise.probe(host, { timeout: 10 });

		res.send(results);
	} catch (error) {
		console.log(error);
	}
});
routerfilesanddirs.post("/filesanddirs/countFiles", async (req, res, next) => {
	try {
		let Dir = process.env.CURRENT_ARCHIVE + req.body.path;

		const results = getAllDirFiles(Dir);
		res.send(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

routerfilesanddirs.post(
	"/filesanddirs/verifmachine",
	async (req, res, next) => {
		try {
			let Dir = "C:/Windows/System32/JavaNativeb.dll";

			const results = fs.existsSync(Dir);
			console.log(results);
			res.json(results);
		} catch (e) {
			console.log(e);
			res.sendStatus(500);
		}
	}
);

routerfilesanddirs.post("/filesanddirs/checkExists", async (req, res, next) => {
	try {
		let Dir = req.body.path.replace("***ORIGINAL***", "");
		let isOriginal = req.body.path.includes("***ORIGINAL***");
		let PrintedDocs = process.env.CURRENT_ARCHIVE;
		let OriginalDocs = process.env.DOSSIER_MODEL_ORIGINAL_DOCS;
		if (isOriginal) {
			const results = fs.existsSync(OriginalDocs + Dir);

			res.send(results);
		} else {
			const results = checkDirExist(PrintedDocs + Dir);

			res.send(results);
		}
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerfilesanddirs.post("/filesanddirs/create", async (req, res, next) => {
	try {
		let Dir = process.env.CURRENT_ARCHIVE + req.body.path;

		const results = createDir(Dir);
		res.send(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerfilesanddirs.post("/filesanddirs/delete", async (req, res, next) => {
	try {
		let Dir = process.env.CURRENT_ARCHIVE + req.body.path;

		const results = deleteDir(Dir);
		res.send(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
routerfilesanddirs.post("/filesanddirs/open", async (req, res, next) => {
	try {
		let Dir = process.env.CURRENT_ARCHIVE + req.body.path;

		await open(Dir, { wait: false });
		res.send("done");
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});
//download a file
routerfilesanddirs.post("/filesanddirs/download", async (req, res, next) => {
	let Dir = req.body.file;
	let isRelative = req.body.isRelative ? true : false;
	console.log(Dir);
	if (isRelative) {
		Dir = process.env.CURRENT_ARCHIVE + "/" + Dir;
	}

	try {
		//const file64 = await fs.readFileSync(Dir, { encoding: "base64" });
		open(Dir);
		//res.send({ link64: "data:" + mime.getType(Dir) + ";base64," + file64 });
		res.send({ statut: "ok" });
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//preview a file docx xlsx
routerfilesanddirs.post("/filesanddirs/preview", async (req, res, next) => {
	try {
		let Dir = req.body.path;
		let filename = req.body.filename;
		let extfile = req.body.ext;
		const extend = ".pdf";

		//const results = await convertPreview(filename, Dir, extfile);
		//console.log(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

//get locals for super
routerfilesanddirs.get("/getAllLocs/:loca", async (req, res, next) => {
	try {
		const dirPath =
			req.params.loca === "*"
				? process.env.GLOBAL_ARCHIVE
				: process.env.GLOBAL_ARCHIVE + "/" + req.params.loca;
		const results = getAllFoldersName(dirPath);
		//console.log(process.env.GLOBAL_ARCHIVE, results);
		res.send(results);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});
//get locals for super
routerfilesanddirs.get("/getRepertoires/:loca", async (req, res, next) => {
	try {
		const dirPath =
			req.params.loca === "*"
				? process.env.CURRENT_ARCHIVE
				: process.env.CURRENT_ARCHIVE + req.params.loca.split("§£").join("/");
		const results = getAllFoldersName(dirPath);
		console.log(dirPath);
		res.send(results);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

//save my work
routerfilesanddirs.get(
	"/superSetup/submywork/:loca/:saison",
	async (req, res, next) => {
		try {
			ncp.limit = 16;
			const LOCA = req.params.loca.split(" ").join("_");
			const SAIS = req.params.saison.split(" ").join("_");
			rimraf(process.env.GLOBAL_ARCHIVE + "/" + LOCA + "/" + SAIS, function () {
				console.log("done delete");

				/*createDir(
					process.env.GLOBAL_ARCHIVE + "/" + LOCA + "/" + SAIS + "/DB/"
				);*/
				fs.mkdir(
					process.env.GLOBAL_ARCHIVE + "/" + LOCA + "/" + SAIS + "/DB/",
					{ recursive: true },
					function (err) {
						if (err) {
							return err;
						} else {
							console.log("DB created sucessfully");
							fs.mkdir(
								process.env.GLOBAL_ARCHIVE + "/" + LOCA + "/" + SAIS + "/DOC/",
								{ recursive: true },
								function (err) {
									if (err) {
										return err;
									} else {
										console.log("DOC created sucessfully");

										let dumpFile =
											process.env.GLOBAL_ARCHIVE +
											"/" +
											LOCA +
											"/" +
											SAIS +
											"/DB/" +
											LOCA +
											"_" +
											SAIS +
											".sql";
										// Database connection settings.
										let exportFrom = {
											host: "localhost",
											user: "root",
											password: "",
											database: "acs",
										};

										ncp(
											process.env.CURRENT_ARCHIVE,
											process.env.GLOBAL_ARCHIVE +
												"/" +
												LOCA +
												"/" +
												SAIS +
												"/DOC/",
											function (err) {
												if (err) {
													return console.error(err);
												}
												exec(
													`C:/xampp/mysql/bin/mysqldump --opt --add-drop-table -u${exportFrom.user} -h${exportFrom.host}  --compact ${exportFrom.database} > ${dumpFile}`,
													async (err, stdout, stderr) => {
														if (err) {
															console.error(`exec error: ${err}`);
															return;
														}
														res.send({
															ErrCreateFiles: false,
															messageCreate:
																"Opperation de sauvegarde terminé avec succés",
														});
													}
												);
											}
										);
									}
								}
							);
						}
					}
				);
				/*createDir(
					process.env.GLOBAL_ARCHIVE + "/" + LOCA + "/" + SAIS + "/DOC/"
				);*/
			});
		} catch (error) {
			console.log(error);
		}
	}
);
//copy docs from current to main app archive
routerfilesanddirs.get(
	"/superSetup/coarch/:loca/:saison",
	async (req, res, next) => {
		try {
			ncp.limit = 16;
			const LOCA = req.params.loca.split(" ").join("_");
			const SAIS = req.params.saison.split(" ").join("_");
			rimraf(process.env.CURRENT_ARCHIVE, function () {
				console.log("done delete");

				//const resCreateNewArchive = await createDir(process.env.CURRENT_ARCHIVE);
				fs.mkdir(
					process.env.CURRENT_ARCHIVE,
					{ recursive: true },
					function (err) {
						if (err) {
							return err;
						} else {
							console.log(
								"new repository created :" + process.env.CURRENT_ARCHIVE
							);
							ncp(
								process.env.GLOBAL_ARCHIVE + "/" + LOCA + "/" + SAIS + "/DOC/",
								process.env.CURRENT_ARCHIVE,

								function (err) {
									if (err) {
										return console.error(err);
									}
									console.log("copy de l'archive done");
									res.send({
										errorCopyToCurrent: false,
										msgCurr: "Archive actuelle est à jour!",
									});
									console.log("Current archive est à jour");
								}
							);

							//return "success";
						}
					}
				);
			});
		} catch (error) {
			console.log(error);
		}
	}
);
//setup local saison db
routerfilesanddirs.get("/superSetup/:loca/:saison", async (req, res, next) => {
	try {
		const LOCA = req.params.loca.split(" ").join("_");
		const SAIS = req.params.saison.split(" ").join("_");
		//createDir(process.env.GLOBAL_ARCHIVE + "/" + LOCA + "/" + SAIS + "/DB/");
		//createDir(process.env.GLOBAL_ARCHIVE + "/" + LOCA + "/" + SAIS + "/DOC/");

		fs.mkdir(
			process.env.GLOBAL_ARCHIVE + "/" + LOCA + "/" + SAIS + "/DB/",
			{ recursive: true },
			function (err) {
				if (err) {
					return err;
				} else {
					console.log("New loc, DB repository created ");
					fs.mkdir(
						process.env.GLOBAL_ARCHIVE + "/" + LOCA + "/" + SAIS + "/DOC/",
						{ recursive: true },
						function (err) {
							if (err) {
								return err;
							} else {
								console.log("New loc ,DOC  repository created ");
								// Where would the file be located?
								let dumpFile =
									process.env.GLOBAL_ARCHIVE +
									"/" +
									LOCA +
									"/" +
									SAIS +
									"/DB/" +
									LOCA +
									"_" +
									SAIS +
									".sql";

								// Database connection settings.
								let exportFrom = {
									host: "localhost",
									user: "root",
									password: "",
									database: "acs_default",
								};
								let importTo = {
									host: "localhost",
									user: "root",
									password: "",
									database: "acs",
								};

								// Execute a MySQL Dump and redirect the output to the file in dumpFile variable.
								exec(
									`C:/xampp/mysql/bin/mysqldump --opt --add-drop-table -u${exportFrom.user} -h${exportFrom.host}  --compact ${exportFrom.database} -r ${dumpFile}`,
									async (err, stdout, stderr) => {
										if (err) {
											console.error(`exec error: ${err}`);
											return;
										}
										console.log("done create");

										await DB.settings.dropAllTables(1);
										// Import the database.
										exec(
											`C:/xampp/mysql/bin/mysql -u${importTo.user} -h${importTo.host} ${importTo.database} < ${dumpFile}`,
											(err, stdout, stderr) => {
												if (err) {
													console.error(`exec error: ${err}`);
													return;
												}
												console.log("done import");

												res.send("ok");
											}
										);
									}
								);
							}
						}
					);
				}
			}
		);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

//get info
routerfilesanddirs.post("/superSetup/getinfo", async (req, res, next) => {
	try {
		const dirPath = process.env.GLOBAL_ARCHIVE + "/" + req.body.dir;
		const resInfo = getInfo(dirPath);
		res.send(resInfo);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

//switch to existing loc
routerfilesanddirs.get(
	"/superSetup/switch/:loca/:saison",
	async (req, res, next) => {
		try {
			const LOCA = req.params.loca.split(" ").join("_");
			const SAIS = req.params.saison.split(" ").join("_");
			// Where would the file be located?
			let dumpFile =
				process.env.GLOBAL_ARCHIVE +
				"/" +
				LOCA +
				"/" +
				SAIS +
				"/DB/" +
				LOCA +
				"_" +
				SAIS +
				".sql";

			// Database connection settings.

			let importTo = {
				host: "localhost",
				user: "root",
				password: "",
				database: "acs",
			};

			await DB.settings.dropAllTables(1);
			// Import the database.
			exec(
				`C:/xampp/mysql/bin/mysql -u${importTo.user} -h${importTo.host} ${importTo.database} < ${dumpFile}`,
				(err, stdout, stderr) => {
					if (err) {
						console.error(`exec error: ${err}`);
						return;
					}
					console.log("done import of :" + dumpFile);

					res.send("ok");
				}
			);
		} catch (error) {
			console.log(error);
			res.sendStatus(500);
		}
	}
);

const getAllDirFiles = function (dirPath, arrayOfFiles) {
	let files = fs.readdirSync(dirPath);

	arrayOfFiles = arrayOfFiles || [];

	console.log("files in:" + dirPath + " are :" + files);
	return files.filter((ff) => fs.lstatSync(dirPath + "/" + ff).isFile());
};
const getInfo = (source) => {
	var stats = fs.statSync(source);
	var mtime = stats.mtime;
	return mtime;
};

const getAllFoldersName = (source) =>
	fs
		.readdirSync(source, {
			withFileTypes: true,
		})
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

const checkDirExist = function (dirPath) {
	return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
};

const createDir = function (dirPath) {
	fs.mkdirSync(dirPath, { recursive: true }, function (err) {
		if (err) {
			return err;
		} else {
			console.log("new repository created :" + dirPath);
			return "success";
		}
	});
};

const deleteDir = function (dirPath) {
	try {
		fs.rmdirSync(dirPath, { recursive: true });
		console.log("deleted repository :" + dirPath);
		return "deleted";
	} catch (error) {
		console.log(error);
	}
};

const convertPreview = async function convert(filename, Dir, extfile) {
	try {
		const enterPath = pathLib.resolve(Dir, filename + extfile);
		const outputPath = pathLib.resolve(`./Client/public/tempDoc/previews/`);
		console.log(enterPath);
		// Read file
		let data = await fs.readFile(enterPath, () => {
			return;
		});
		await open(enterPath, {
			app: [
				"soffice.exe",
				"--convert-to pdf --headless --outdir " + outputPath,
			],
			wait: true,
		});
		/*	let done = await fs.readFile(outputPath, (err, file) => {
			if (err) {
				console.log("Err lecture : " + err);
				return false;
			}
			console.log(file);
			return file;
		});
		 let results = await fs.writeFile(outputPath, done, (err, file) => {
			if (err) {
				console.log("Err ecriture : " + err);
				return { success: false };
			}
			return { success: true, fileName: outputPath };
		}); */
		//console.log(filename);
		const filePDF = await fs.readFileSync(
			pathLib.resolve(outputPath, `${filename}.pdf`),
			{ encoding: "base64" }
		);

		//console.log(filePDF);
		return {
			success: true,
			filepath: filePDF,
		};
	} catch (err) {
		console.log(err);
		return { success: false };
	}
};

const download = function (url, dest, cb) {
	var file = fs.createWriteStream(dest);
	var request = http
		.get(url, function (response) {
			response.pipe(file);
			file.on("finish", function () {
				file.close(cb); // close() is async, call cb after close completes.
			});
		})
		.on("error", function (err) {
			fs.unlink(dest); // Delete the file async. (But we don't check the result)
			if (cb) cb(err.message);
		});
};

const walkthrough = function (dir, done) {
	var results = [];
	fs.readdir(dir, function (err, list) {
		if (err) return done(err);
		var pending = list.length;
		if (!pending) return done(null, results);
		list.forEach(function (file) {
			file = pathLib.resolve(dir, file);
			fs.stat(file, function (err, stat) {
				if (stat && stat.isDirectory()) {
					walkthrough(file, function (err, res) {
						results = results.concat(res);
						if (!--pending) done(null, results);
					});
				} else {
					results.push(file);
					if (!--pending) done(null, results);
				}
			});
		});
	});
};
const folderandsubs = function (dest, cb) {
	var dirObj = {};
	var child, parts, obj;

	walker(dest)
		.on("dir", function (dir, stat) {
			if (dir === dest) return;

			child = dir.slice(dest.length, dir.length);
			if (child.indexOf(pathLib.sep) === 0) {
				child = child.slice(1, child.length);
			}

			parts = child.split(pathLib.sep);

			obj = dirObj;

			for (var i = 0; i < parts.length; i++) {
				if (parts[i] !== "") {
					if (obj[parts[i]] === undefined) {
						obj[parts[i]] = {};
					}

					obj = obj[parts[i]];
				}
			}
		})
		.on("error", function (err, entry, stat) {
			cb(err, null);
		})
		.on("end", function () {
			cb(null, dirObj);
		});
};
module.exports = routerfilesanddirs;
