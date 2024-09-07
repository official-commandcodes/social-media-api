const mongoose = require("mongoose");
const slug = require("slug");
const { v4: uuidv4 } = require("uuid");

const DataSecurity = require("../helpers/security/data.security");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      minlength: [3, "username is short"],
      maxlength: [255, "username is too long"],
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
      select: false,
    },

    slug: String,

    manualId: String,

    otp: {
      type: String,
      select: false,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      match: /^(?=[a-zA-Z0-9@.!#$%&'*+/=?^_`{|}~-]{1,254}$)(?=[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,63}$/,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      min: [6, "'password' length must be at least 6 characters long"],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  this.slug = slug(this.username); // create a slug for the username
  this.manualId = uuidv4(); // create uuid string

  next();
});

// Hash password before saving it to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await DataSecurity.hash(this.password);
  return next();
});

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
