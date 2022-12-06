import { setupWorker, rest } from "msw";
import data from "./data.json";

export const worker = setupWorker(
  rest.get("/api/meals", async (_req, res, ctx) => {
    return res(ctx.json(data));
  })
);
