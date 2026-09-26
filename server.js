const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


// ===============================
// GET PROFILE
// ===============================

app.get("/api/profile", (req, res) => {

    fs.readFile("profile.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Unable to read profile"
            });
        }

        const profile = JSON.parse(data);

        res.json(profile);
    });
});


// ===============================
// UPDATE PROFILE
// ===============================

app.put("/api/profile", (req, res) => {

    const updatedProfile = req.body;

    fs.writeFile(
        "profile.json",
        JSON.stringify(updatedProfile, null, 4),
        (err) => {

            if (err) {
                return res.status(500).json({
                    message: "Unable to update profile"
                });
            }

            res.json({
                message: "Profile updated successfully",
                profile: updatedProfile
            });
        }
    );
});


// ===============================
// SERVER
// ===============================

app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});