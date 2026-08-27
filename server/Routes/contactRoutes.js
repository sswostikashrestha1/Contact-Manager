const express = require("express");

const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const requireAuth = require("../middleware/requireAuth");
const upload = require("../middleware/upload");

const router = express.Router();

// All contact routes require authentication
router.use(requireAuth);

// Create contact (with optional avatar upload)
router.post("/", upload.single("avatar"), createContact);

// Get all contacts
router.get("/", getContacts);

// Get contact by ID
router.get("/:id", getContactById);

// Update contact (with optional avatar upload)
router.put("/:id", upload.single("avatar"), updateContact);

// Delete contact
router.delete("/:id", deleteContact);

module.exports = router;