const mongoose = require("mongoose");

const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Transaction name is required.",
      maxlength: [120, "Transaction name should not exceed 100 characters."]
    },
    value: {
      type: Number,
      required: "Enter an amount.",
      validate: {
        validator: function(amount) {
          return amount !== 0;
        },
        message: "Amount cannot be zero."
      }
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
