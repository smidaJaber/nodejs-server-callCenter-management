const sqlEnginsGlobal = require("./enginsGlobal");
const sqlCamionsGlobal = require("./camionsGlobal");
const sqlAnnonce = require("./annonces");
const sqlAgent = require("./agentsGlobal");
const sqlUser = require("./users");
const sqlSettings = require("./settings");
const sqlImages = require("./imageupload");
const sqlSubcategories = require("./subCategorie");
const sqlCategories = require("./categories");

let DBZSC = {};

DBZSC.camionsglobales = sqlCamionsGlobal;
DBZSC.enginsglobales = sqlEnginsGlobal;
DBZSC.annonce = sqlAnnonce;
DBZSC.agent = sqlAgent;
DBZSC.users = sqlUser;
DBZSC.settings = sqlSettings;
DBZSC.imageUpload = sqlImages;
DBZSC.subcategories = sqlSubcategories;
DBZSC.categories = sqlCategories;

module.exports = DBZSC;
