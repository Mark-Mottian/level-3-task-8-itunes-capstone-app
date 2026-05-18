import jwt from "jsonwebtoken";

/* <=== APP TOKEN CONTROLLER ===> */

export function createAppToken(req, res) {
  /*
   * Task requirement:
   * Use JWT to authorise API requests and secure the API.
   *
   * The task does not require user authentication, so there is no signup or login flow.
   * Instead, the backend issues an app-level token that allows the frontend to call protected routes.
   */
  const tokenPayload = {
    app: "itunes-search-capstone",
    purpose: "search-api-access",
  };

  /*
   * The token is signed with ACCESS_TOKEN_SECRET from backend/.env.
   * This means the same backend can later verify that the token was created by this server.
   */
  const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  /*
   * The frontend stores this token in React state and sends it in the Authorization header.
   */
  return res.status(200).json({ token });
}
