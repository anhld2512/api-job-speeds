// controllers/profileController.js
const Profile = require("../models/profileModel");

// Create a new profile
exports.createProfile = async (req, res) => {
  try {
    const profile = new Profile(req.body);
    await profile.save();
    res.status(201).send(profile);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all profiles
exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).send(profiles);
  } catch (error) {
    res.status(500).send({
      result:false,
      error:error
    });
  }
};

// Get profile by ID
exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.id });
    if (!profile) {
      return res.json({ result: false, message: "Profile not found" });
    }
    res.status(200).json({ result: true, data: profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ result: false, message: "Internal server error" });
  }
};


// Update profile by ID
exports.updateProfile = async (req, res) => {
  try {
    let profile;
    delete req.body._id;
    // Tìm kiếm hồ sơ với ID được cung cấp
    profile = await Profile.findOneAndUpdate(
      { _id: req.params.id }, // Điều kiện tìm kiếm
      req.body, // Dữ liệu cập nhật
      { new: true, upsert: true, runValidators: true } // Tùy chọn: upsert để tạo mới nếu không tìm thấy
    );

    res.status(200).json({ result: true, data: profile });
  } catch (error) {
    res.status(400).json({
      result: false,
      error: error.message
    });
  }
};




// Delete profile by ID
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) {
      return res.json({ result: false });
    }
    res.status(200).send(profile);
  } catch (error) {
    res.status(500).send({
      result:false,
      error:error
    });
  }
};
