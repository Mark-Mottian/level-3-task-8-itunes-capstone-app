import express from "express";

import { createAppToken } from "../controllers/auth-controller.js";

/* <=== AUTH ROUTER SETUP ===> */

const router = express.Router();

/* <=== APP TOKEN ROUTE ===> */

/*
 * Task requirement:
 * Use JWT to authorise API requests and secure the API.
 *
 * GET /api/auth/token gives the frontend an app-level JWT.
 * There is no user login because user authentication is not required for this task.
 */
router.get("/token", createAppToken);

export default router;
