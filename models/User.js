import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      default: "",
    },
    mobileNumber: {
      type: Number,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      max: 50,
      unique: true,
      },
      pdflink:{
        type: String
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
