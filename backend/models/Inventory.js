const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  itemCode: { type: String, required: true, unique: true },
  itemName: { type: String, required: true },
  category: String,
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'Piece' },
  unitPrice: Number,
  totalValue: Number,
  supplier: String,
  location: String,
  minimumStock: Number,
  status: { 
    type: String, 
    enum: ['Available', 'Low Stock', 'Out of Stock'],
    default: 'Available'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const purchaseSchema = new mongoose.Schema({
  purchaseNumber: { type: String, unique: true },
  supplier: String,
  items: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem' },
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  totalAmount: Number,
  purchaseDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Pending', 'Received', 'Cancelled'],
    default: 'Pending'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  InventoryItem: mongoose.model('InventoryItem', inventoryItemSchema),
  Purchase: mongoose.model('Purchase', purchaseSchema)
};

