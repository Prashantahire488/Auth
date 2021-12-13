const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("product", productSchema);