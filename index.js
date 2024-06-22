import express from "express";
import { getGuardianUrl } from "./utils/link.grabber.js";
import { uploadImg } from "./utils/cloudinary.operation.js";

const app = express();

const imgFromSite = await getGuardianUrl();
const serveLink = await uploadImg("guardian", imgFromSite);

console.log(serveLink);
