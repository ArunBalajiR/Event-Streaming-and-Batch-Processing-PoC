const mongoose = require('mongoose');

const DetailSchema = mongoose.Schema(
  {
    documentTitle: {
      type: String,
      unique: false,
    },
    documentDesc: {
      type: String,
    },
    documentContent: {
      type: String,
    },
    documentUrl: {
      type: String,
    },
    documentDomain: {
      type: String,
    },
    fileType: {
        type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DetailSchema);
