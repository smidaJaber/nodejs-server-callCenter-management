const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const os = require("os");
const homeDirDocs = os.userInfo().homedir + "\\Documents\\ZSC";
router.get("/getCnts", async (req, res) => {
	try {
		const pathListeContact = homeDirDocs + "\\cnts.json";
		const RAW_listeContacts = fs.readFileSync(pathListeContact);
		const listeContacts = JSON.parse(RAW_listeContacts);
		res.json(
			listeContacts.map((cnt) => {
				return { name: cnt.name, number: cnt.id.split("@")[0] };
			}) || []
		);
	} catch (error) {
		res.json([]);
		console.log(error);
	}
});
router.get("/checkauth", async (req, res) => {
	if (typeof client !== "undefined" && client["user"]) {
		console.log("cncted to wa from auth serever comp");
		res.json({ status: "CONNECTED", user: client["user"] });
	} else {
		console.log("DISSScnt to wa from auth serever comp");
		res.json({ status: "DISCONNECTED", user: {} });
	}
});

router.get("/getqr", async (req, res) => {
	if (typeof client === "undefined") {
		res.send(WhatsAppUpdates.qr);
	} else {
		res.write("<html><body><h2>Already Authenticated</h2></body></html>");
		res.end();
	}
});

module.exports = router;
