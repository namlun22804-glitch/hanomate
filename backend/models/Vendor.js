const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên vendor'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    priceRange: {
      min: { type: Number },
      max: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

vendorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Vendor', vendorSchema);
