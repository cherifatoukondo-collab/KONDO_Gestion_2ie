const express = require("express");

const createResourceRoutes = (controller, validateResource) => {
  const router = express.Router();

  router.get("/", controller.getAll);
  router.get("/:id", controller.getById);
  router.post("/", validateResource, controller.create);
  router.put("/:id", validateResource, controller.update);
  router.delete("/:id", controller.remove);

  return router;
};

module.exports = createResourceRoutes;
