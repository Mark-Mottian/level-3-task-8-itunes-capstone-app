import express from "express";

import { searchItunes } from "../controllers/search-controller.js";
import { authorizeApiRequest } from "../middleware/auth-middleware.js";

/* <=== SEARCH ROUTER SETUP ===> */

const router = express.Router();

/* <=== PROTECTED SEARCH ROUTE ===> */

/*
 * Task requirement:
 * The backend must process API requests and communicate with the iTunes Search API.
 *
 * Task requirement:
 * Use JWT to authorise API requests and secure the API.
 *
 * Middleware runs before the controller.
 * First, authorizeApiRequest verifies the JWT.
 * Then, searchItunes calls the iTunes Search API and returns cleaned results.
 */
router.get("/", authorizeApiRequest, searchItunes);

export default router;
