const appModulePath = require("app-module-path");
const cors = require("cors");

appModulePath.addPath(`${__dirname}`);

const express = require("express");
const path = require("path");

//var crypto = require("crypto");
//wa
const fs = require("fs");
const os = require("os");
const homeDirDocs = os.userInfo().homedir + "\\Documents\\ZSC";

//wa
const http = require("http");
const app = express();
var serverRealTime = http.createServer(app);
const { WebSocketServer, WebSocket } = require("ws");

const wss = new WebSocketServer({ server: serverRealTime });
require("dotenv").config({ path: __dirname + "/.env" });

import makeWASocket, {
	BufferJSON,
	useSingleFileAuthState,
	DisconnectReason,
} from "@adiwajshing/baileys-md";

var MMT = require("moment");
//connexion
var passport = require("passport");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

var nodemailer = require("nodemailer");

app.set("socketio", wss);
const spawn = require("child_process").spawn;

var StartcleanerBat =
	homeDirDocs + "\\tools\\cleanup_and_start_xampp\\cleanup_and_start_xampp.exe";
var startDBC = homeDirDocs + "\\tools\\check_connection_db_zsc.exe";
var StartapacheBat = "C:\\xampp\\apache_start.bat";
var StartmysqlBat = "C:\\xampp\\mysql_start.bat";
var StopapacheBat = "C:\\xampp\\apache_stop.bat";
var StopmysqlBat = "C:\\xampp\\mysql_stop.bat";

const StartCL = spawn("cmd.exe", ["/c", StartcleanerBat]);

StartCL.on("exit", (code) => {
	const StartAB = spawn("cmd.exe", ["/c", StartapacheBat]);
	const StartMB = spawn("cmd.exe", ["/c", StartmysqlBat]);

	StartAB.on("exit", (code) => {
		spawn("cmd.exe", ["/c", StopapacheBat]);
	});
	StartMB.on("exit", (code) => {
		spawn("cmd.exe", ["/c", StopmysqlBat]);
	});
	return true;
});

//#region  ROUTES

//Routes

const routerUsers = require("./Routes/users");
const routerCamion = require("./Routes/camionGlobal");
const routerEngin = require("./Routes/enginsGlobal");
const routerAnnonce = require("./Routes/annonces");
const routerAgent = require("./Routes/agent");
const routerSettings = require("./Routes/settings");
const routerExcel = require("./Routes/saveToExcel");
const routerImageUpload = require("./Routes/imageupload");
const routerSubcategories = require("./Routes/subCategories");
const routerCategories = require("./Routes/categories");

//const fileUpload = require("express-fileupload");
//#endregion ROUTES

app.use(
	session({
		key: process.env.SESSIONSDB_NAME,
		secret: process.env.SESSIONSDB_SECRET,
		store: new MySQLStore({
			host: "localhost",
			port: 3306,
			user: "root",
			database: "consuzs",
		}),
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

//cors
app.use(
	cors({
		origin: true,
		methods: ["GET", "POST"],
		credentials: true,
	})
);
/*production ext */
app.use(express.static(path.join(__dirname, "../build")));
/*allow client to send files */
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requeted-With, Content-Type, Accept, Authorization, RBR"
	);
	if (req.headers.origin) {
		res.header("Access-Control-Allow-Origin", req.headers.origin);
	}
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
		return res.status(200).json({});
	}

	next();
});
/*  expires in 1 day */

//usesssss
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
//app.use(bodyParser.json({}));
//wa
/*
client.on("qr", (qr) => {
	wss.clients.forEach(function each(client) {
		if (client !== wss && client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify({ type: "WAFlashCode", data: qr }), {
				binary: false,
			});
		}
	});
	QrTerminal.generate(qr, { small: true });
	fs.writeFileSync(path.resolve(__dirname, "components/last.qr"), qr);
});

client.on("authenticated", (session) => {
	console.log("AUTH!");
	wss.clients.forEach(function each(client) {
		if (client !== wss && client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify({ type: "WAFlashAuthed", data: session }), {
				binary: false,
			});
		}
	});
	sessionCfg = session;

	try {
		fs.unlinkSync(path.resolve(__dirname, "components/last.qr"));
	} catch (err) {}
});

client.on("auth_failure", (msg) => {
	console.log("AUTH Failed !", msg);
	sessionCfg = "";
	wss.clients.forEach(function each(client) {
		if (client !== wss && client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify({ type: "WAFlashAuThFailed", data: 0 }), {
				binary: false,
			});
		}
	});
	client.initialize();
	//process.exit();
});

client.on("ready", async () => {
	console.log("Client is ready!");
	try {
		const cnts = await client.getContacts();
		/*cnts.map((cnt) => {
			cnt.isWAContact &&
				cnt.isMyContact &&
				console.log(
					cnt.name +
						": " +
						(cnt.number || "NoNumber") +
						"(Bloqué ? " +
						(cnt.isBlocked ? "Oui" : "Non") +
						")"
				);
		});lessit */
/*	wss.clients.forEach(function each(client) {
			if (client !== wss && client.readyState === WebSocket.OPEN) {
				client.send(
					JSON.stringify({ type: "WAFlashGotContacts", data: cnts }),
					{
						binary: false,
					}
				);
			}
		});
		//console.log(cnts[0]);
	} catch (error) {
		console.log(error);
	}
});

client.on("message", async (msg) => {
	if (config.webhook.enabled) {
		if (msg.hasMedia) {
			const attachmentData = await msg.downloadMedia();
			msg.attachmentData = attachmentData;
		}
		axios.post(config.webhook.path, { msg });
	}
	if (msg.type == "buttons_response") {
		const { selectedButtonId: bid } = msg;
		if (bid == "customId") msg.reply("You chose button 1");
		// this is a buttons message response
	}
});
//client.initialize();
*/
const { state, saveState } = useSingleFileAuthState(
	homeDirDocs + "\\auth_info_multi.json"
);
global.WhatsAppUpdates = {};

async function connectToWhatsApp() {
	const sock = makeWASocket({
		// can provide additional config here
		auth: state,
		printQRInTerminal: true,
		version: [2, 2204, 13],
	});
	sock.ev.on("creds.update", () => {
		saveState();
		global.client = sock;
		wss.clients.forEach(function each(client) {
			if (client !== wss && client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify({ type: "WAFlashAuthed", data: state }), {
					binary: false,
				});
			}
		});
	});
	sock.ev.on("connection.update", (update) => {
		const { connection, lastDisconnect, qr } = update;
		if (qr) {
			console.log(qr);
			wss.clients.forEach(function each(client) {
				if (client !== wss && client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify({ type: "WAFlashCode", data: qr }), {
						binary: false,
					});
				}
			});
			try {
				fs.unlinkSync(homeDirDocs + "\\auth_info_multi.json");
			} catch (err) {}
		}
		if (connection === "close") {
			const shouldReconnect =
				lastDisconnect.error &&
				lastDisconnect.error.output &&
				lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
			console.log(
				"connection closed due to ",
				lastDisconnect.error,
				", reconnecting ",
				shouldReconnect
			);
			wss.clients.forEach(function each(client) {
				if (client !== wss && client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify({ type: "WAFlashAuThFailed", data: "" }), {
						binary: false,
					});
				}
			});
			try {
				fs.unlinkSync(homeDirDocs + "\\auth_info_multi.json");
			} catch (err) {}
			// reconnect if not logged out
			if (shouldReconnect) {
				connectToWhatsApp();
			}
		} else if (connection === "open") {
			console.log("opened connection");
			global.client = sock;
			wss.clients.forEach(function each(client) {
				if (client !== wss && client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify({ type: "WAFlashAuthed", data: state }), {
						binary: false,
					});
				}
			});
		}
	});

	/*	sock.ev.on("messages.upsert", async (m) => {
		console.log(JSON.stringify(m, undefined, 2));

		console.log("replying to", m.messages[0].key.remoteJid);
		await sock.sendMessage(m.messages[0].key.remoteJid || "Zero", {
			text: "Hello there!",
		});
	});*/
}
// run in main file

const chatRoute = require("./components/chatting");
const groupRoute = require("./components/group");
const authRoute = require("./components/auth");
const contactRoute = require("./components/contact");

//wa
app.use("/api/zsc", routerUsers);
app.use("/api/zsc", routerCamion);
app.use("/api/zsc", routerEngin);
app.use("/api/zsc", routerAnnonce);
app.use("/api/zsc", routerAgent);
app.use("/api/zsc", routerSettings);
app.use("/api/zsc", routerExcel);
app.use("/api/zsc", routerImageUpload);
app.use("/api/zsc", routerSubcategories);
app.use("/api/zsc", routerCategories);
//wa
app.use("/api/zsc/chat", chatRoute);
app.use("/api/zsc/group", groupRoute);
app.use("/api/zsc/auth", authRoute);
app.use("/api/zsc/contact", contactRoute);

//wa
//real time
let newData = false;
const sendData = async (id, res, event, data) => {
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		Connection: "keep-alive",
	});
	const dataString = JSON.stringify(data);
	res.write("event: " + event + "\n");

	res.write("data: " + dataString);
	res.write("\n\n");
};
app.get("/eventsBro", (req, res) => {
	sendData(1, res, "message", "datatatata");

	res.end();
});
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../build/index.html"));
});

//server status
const port = 5000;

app.get("/test", (req, res) => res.status(200).send("success!"));
app.get("/api/zsc/checkerdendencies", (req, res) =>
	/*
xampp-windows-x64-x.y.z-installer.exe --mode unattended --launchapps 0
*/
	res.status(200).send("checking...")
);
app.get("/api/acs/closetunnel", (req, res) => {
	res.status(200).send("disconencted A AcC!");
});
app.get("/api/zsc/connecttowhatsapp", (req, res) => {
	connectToWhatsApp()
		.then((r) => {
			res.status(200).send("executed wa loop..");
		})
		.catch((error) => console.log("unexpected error: " + error));
});
app.get("/*", (req, res) => {
	res.redirect("/");
});
/*
app.get("/", (req, res) => {
	res
		.set(
			"Content-Security-Policy",
			"default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
		)
		.sendFile(path.join(__dirname, "../build/index.html"));
});

*/
wss.on("connection", function (clientId) {
	// event listener logic
	//console.log(clientId);
	console.log("wss New client connected");
	app.set("socketio", wss);
	wss.on("disconnect", () => {
		console.log("wss Client disconnected");
	});
});
serverRealTime.listen(port, async () => {
	console.log(`zsc server running on port ${port}`);

	//contact_admin()
});

function contact_admin(sfrom, sto, ssubj, smsg) {
	var transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.APP_MAIL_ADR,
			pass: process.env.APP_MAIL_PWD,
		},
	});

	var mailOptions = {
		from: sfrom !== "" ? "Application ZSC" : sfrom,
		to: sto !== "" ? sto : process.env.CONTACT_ADMIN,
		subject: ssubj !== "" ? ssubj : "Administration : Accès (Mise à jour code)",
		html:
			smsg !== ""
				? smsg
				: `
				 
				 <div style="background:#203647;color:#fff;">
			<div style="margin-left:10px;padding-left:10px;">	
			<br/>
				 <br/>
				<h1 >
				<b style="color:#e9b225;font-size:24px;font-family:Roboto;">ACS</b>
				<b style="color:#007cc7;font-size:20px;font-family:Roboto;margin-left:0px;padding-left:0px;">app</b>
				</h1>
			 	<hr/>
				 
				<h2 style="color:#fff;font-family:Roboto;" >
				Bonjour ADMIN, 
				<br/>
				 
				
				<b style="color:#fff;font-family:Roboto;">voici votre nouveau code :</b> <b style="color:#e9b225;font-size:30px;font-family:Roboto;margin-left:0px;padding-left:0px;">` +
				  process.env.DEFAULT_TUNNEL +
				  `</b>
				 
				</h2>
				<hr/>
				Sent by ACSapp @` +
				  MMT().format("HH:mm:ss") +
				  ` Le ` +
				  MMT().format("DD/MM/YYYY") +
				  `
			</div>
				</div> 
				`,
	};
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
}
