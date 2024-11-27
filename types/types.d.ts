import session from "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string; // Add any custom session properties here
  }
}

declare module "express" {
  interface Request {
    session: session.Session & session.SessionData;
  }
}
