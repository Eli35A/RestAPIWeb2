import { Response } from "express";

export const NotFoundError = (res: Response, message = "Not Found") => {
  return res.status(404).json({ error: message });
}

export const BadRequestError = (res: Response, message = "Bad Request") => {
  return res.status(400).json({ error: message });
}
