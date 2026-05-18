import jwt from "jsonwebtoken";

/* <=== JWT AUTHORIZATION MIDDLEWARE ===> */

export function authorizeApiRequest(req, res, next) {
  /*
   * Task requirement:
   * Use JWT to authorise API requests and secure the API.
   *
   * This middleware protects backend routes by requiring a valid Bearer token.
   * If the token check fails, the search controller never runs.
   */
  const authHeader = req.headers.authorization;

  /*
   * The frontend must send the token in the Authorization header.
   * Expected format:
   * Authorization: Bearer <token>
   */
  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header is required.",
    });
  }

  /*
   * Extract the token from the Bearer format.
   * The fallback allows a raw token, but the frontend sends Bearer tokens.
   */
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  /*
   * If the header exists but the token is empty, the request is still not authorised.
   */
  if (!token) {
    return res.status(401).json({
      message: "Bearer token is required.",
    });
  }

  try {
    /*
     * jwt.verify() checks that the token was signed with the backend secret.
     * It also rejects expired tokens and tokens that have been changed.
     */
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    /*
     * Store the decoded token on the request object.
     * This is not required for user identity here, but it proves the request passed authorization.
     */
    req.appToken = decodedToken;

    /*
     * next() passes the request to the search controller.
     */
    return next();
  } catch (error) {
    /*
     * Invalid or expired tokens receive 403 because the request was understood but not allowed.
     */
    return res.status(403).json({
      message: "Invalid or expired token.",
    });
  }
}
