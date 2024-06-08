import PDFDocument from "pdfkit";
import fs from "fs";
import express from "express";
import User from "../models/User.js";

const router = express.Router();

/* Getting user by id */
router.get("/getuser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId; // Get user ID from URL parameters
    const user = await User.findById(userId);
    console.log(user);
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

/* Getting all members in the library */
router.get("/alluser", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
});

/* Update user by id */
router.put("/updateuser", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $set: req.body,
    });
    res.status(200).json("Account has been updated");
  } catch (err) {
    return res.status(500).json(err);
  }
});

/* Create user */
router.post("/createuser", async (req, res) => {
  try {
    const { name, email, mobileNumber, address } = req.body;
    console.log(name, address, mobileNumber, email);
    
    // Validate input
    if (!name || !address || !mobileNumber || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new user instance
    const newUser = new User({
      name,
      address,
      mobileNumber,
      email,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    // Create a new PDF document
    const doc = new PDFDocument();

    // Pipe the PDF content to a writable stream
    const fileName = `${name}-${mobileNumber}.pdf`

    const stream = fs.createWriteStream(fileName);

    doc.pipe(stream);

    // Add content to the PDF
    doc.fontSize(16).text("User Details", { align: "center" }).moveDown();
    doc.fontSize(12).text(`Name: ${name}`).moveDown();
    doc.text(`Address: ${address}`).moveDown();
    doc.text(`Mobile Number: ${mobileNumber}`).moveDown();
    doc.text(`Email: ${email}`).moveDown();

    // Finalize the PDF
    doc.end();

    console.log("PDF generated successfully");

    res.status(201).json({ 
      message: "Account has been created and PDF generated successfully", 
      user: savedUser,
      fileName: `${name}-${mobileNumber}.pdf`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* Delete user by id */
router.post("/deleteuser", async (req, res) => {
  try {
    console.log(req.body);
    await User.findByIdAndDelete(req.body._id);
    res.status(200).json("Account has been deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;
