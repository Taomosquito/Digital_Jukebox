import session from "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    username?: string;
    geo?: { latitude: number; longitude: number; inRange: boolean };
  }
}

declare module "express" {
  interface Request {
    session: session.Session & session.SessionData;
  }
}
