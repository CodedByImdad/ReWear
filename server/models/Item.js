const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Shirts',
          'T-Shirts',
          'Pants',
          'Jeans',
          'Jackets',
          'Dresses',
          'Shoes',
          'Accessories',
          'Other',
        ],
        message: 'Invalid category',
      },
    },
    size: {
      type: String,
      required: [true, 'Size is required'],
      enum: {
        values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
        message: 'Invalid size',
      },
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: {
        values: ['New', 'Like New', 'Good', 'Used'],
        message: 'Invalid condition',
      },
    },
    gender: {
      type: String,
      required: [true, 'Target/gender is required'],
      enum: {
        values: ['Men', 'Women', 'Unisex', 'Kids'],
        message: 'Invalid target/gender',
      },
    },
    image: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [80, 'Location cannot exceed 80 characters'],
    },
    type: {
      type: String,
      required: [true, 'Type (Exchange or Donation) is required'],
      enum: {
        values: ['Exchange', 'Donation'],
        message: 'Type must be Exchange or Donation',
      },
    },
    status: {
      type: String,
      enum: ['Available', 'Requested', 'Exchanged', 'Donated', 'Removed'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

itemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Item', itemSchema);
