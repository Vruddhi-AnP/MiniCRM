
const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

// 🔥 NEW CLIENT FORM (ABOVE :id)
router.get("/clients/new", clientController.showNewClientForm);

// 🔥 CREATE CLIENT (POST)
router.post("/clients/new", clientController.createClient);

// List clients
router.get("/clients", clientController.listClients);

// Client detail
router.get("/clients/:id", clientController.getClientDetail);

module.exports = router;





