import { readFileSync } from "fs";

export const JWT = {
  SECRET_KEY: readFileSync("./certificates/key.pem", "utf8"),
};
