const mongoose = require('mongoose');

// Organization Schema
const OrganizationSchema = new mongoose.Schema({
  organizationId: {
    type: Number,
    required: true,
    unique: true
  },
  organizationName: {
    type: String, required: true
  },
});
const Organization = mongoose.model('Organization', OrganizationSchema);

// item schema
const ItemSchema = new mongoose.Schema({
  itemId: {
    type: Number,
    required: true,
    unique: true
  },
  itemType: {
    type: String,
    required: true,
    enum: ['perishable', 'non-perishable']
  },
  itemDescription: {
    type: String,
    required: true,
  }
});
const Item = mongoose.model('Item', ItemSchema)

module.exports = {
  Organization,
  Item,
};
