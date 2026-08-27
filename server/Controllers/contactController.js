const Contact = require("../models/Contact");
const fs = require("fs");
const path = require("path");

// Helper to delete an avatar file from disk
const deleteAvatarFile = (avatarPath) => {
  if (avatarPath && avatarPath.startsWith("/uploads/")) {
    const filename = avatarPath.replace("/uploads/", "");
    const fullPath = path.join(__dirname, "../uploads", filename);
    if (fs.existsSync(fullPath)) {
      fs.unlink(fullPath, (err) => {
        if (err) console.error("Error deleting avatar file:", err);
      });
    }
  }
};

// Create a contact
const createContact = async (req, res) => {
  try {
    const { name, phone, email, address, notes, category } = req.body;

    // Validate required fields
    if (!name || !phone) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: "Name and phone are required",
      });
    }

    let avatar = "";
    if (req.file) {
      avatar = `/uploads/${req.file.filename}`;
    }

    const contact = await Contact.create({
      name,
      phone,
      email,
      address,
      notes,
      category: category || "Other",
      avatar,
      user: req.session.userId,
    });

    res.status(201).json({
      message: "Contact created successfully",
      contact,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Create contact error:", error);
    res.status(500).json({
      message: "Server error while creating contact",
    });
  }
};

// Get all contacts for the logged-in user
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({
      user: req.session.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({
      message: "Server error while fetching contacts",
    });
  }
};

// Get one contact by ID
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.session.userId,
    });

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    res.status(200).json({
      contact,
    });
  } catch (error) {
    console.error("Get contact error:", error);
    res.status(400).json({
      message: "Invalid contact ID",
    });
  }
};

// Update a contact
const updateContact = async (req, res) => {
  try {
    const { name, phone, email, address, notes, category } = req.body;

    if (!name || !phone) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: "Name and phone are required",
      });
    }

    const existingContact = await Contact.findOne({
      _id: req.params.id,
      user: req.session.userId,
    });

    if (!existingContact) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    let avatar = existingContact.avatar;
    if (req.file) {
      // If a new avatar is uploaded, delete the old one
      deleteAvatarFile(existingContact.avatar);
      avatar = `/uploads/${req.file.filename}`;
    }

    existingContact.name = name;
    existingContact.phone = phone;
    existingContact.email = email;
    existingContact.address = address;
    existingContact.notes = notes;
    existingContact.category = category || "Other";
    existingContact.avatar = avatar;

    const updatedContact = await existingContact.save();

    res.status(200).json({
      message: "Contact updated successfully",
      contact: updatedContact,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Update contact error:", error);
    res.status(400).json({
      message: "Invalid contact data",
    });
  }
};

// Delete a contact
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      user: req.session.userId,
    });

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    // Delete associated avatar file if present
    deleteAvatarFile(contact.avatar);

    res.status(200).json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(400).json({
      message: "Invalid contact ID",
    });
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
};
