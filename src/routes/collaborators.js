const express = require("express");
const router = express.Router();
const validation = require("./validation");
const helper = require("../auth/helpers");

const collaboratorController = require("../controllers/collaboratorController")

router.get("/wikis/:wikiId/collaborators", collaboratorController.show);

router.post("/wikis/:wikiId/collaborators/create",
  validation.validateCollaborators,
  collaboratorController.create);

router.post("/wikis/:wikiId/collaborators/:collaboratorId/destroy",
  collaboratorController.destroy);

module.exports = router;