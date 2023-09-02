const mongoose = require("mongoose");

const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Transaction name is required.",
      minlength: [3, "Transaction name must be at least 3 characters long."],
      maxlength: [100, "Transaction name should not exceed 100 characters."],
      validate: function(v) {
        return typeof v === 'string' && !Number.isFinite(v) && isNaN(Number(v));
      },
      message: "Name should be a string and not a number."
    },
    value: {
      type: Number,
      required: "Enter an amount.",
      min: [1, "Amount cannot be negative."],
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
