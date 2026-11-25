
import express from "express";
import upload from "../middleware/upload.middleware.js";

import {
  uploadDocument,
  extractDocument,
  chunkDocument,
  embedDocument,
  storeDocument,
  searchDocument,
  askQuestion
} from "../controllers/document.controller.js";

const router = express.Router();

// Upload document
router.post(
  "/upload",
  upload.single("document"),
  uploadDocument
);

// Extract document text
router.post(
  "/extract",
  upload.single("document"),
  extractDocument
);
// Split document into chunks
router.post(
  "/chunk",
  upload.single("document"),
  chunkDocument
);
export default router;
router.post("/embed", upload.single("document"), embedDocument);
router.post("/store", upload.single("document"), storeDocument);
router.post("/search", searchDocument);
router.post("/ask", askQuestion);