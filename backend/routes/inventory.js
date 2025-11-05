const express = require('express');
const { InventoryItem, Purchase } = require('../models/Inventory');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Inventory items
router.get('/items', auth, async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/items', auth, async (req, res) => {
  try {
    const item = new InventoryItem(req.body);
    item.totalValue = item.quantity * (item.unitPrice || 0);
    if (item.quantity <= item.minimumStock) {
      item.status = 'Low Stock';
    }
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/items/:id', auth, async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    item.totalValue = item.quantity * (item.unitPrice || 0);
    if (item.quantity <= item.minimumStock) {
      item.status = 'Low Stock';
    } else if (item.quantity === 0) {
      item.status = 'Out of Stock';
    } else {
      item.status = 'Available';
    }
    await item.save();
    
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Purchases
router.get('/purchases', auth, async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('items.item')
      .populate('createdBy');
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/purchases', auth, async (req, res) => {
  try {
    const purchase = new Purchase({
      ...req.body,
      createdBy: req.user.userId
    });
    await purchase.save();
    
    // Update inventory
    if (purchase.status === 'Received') {
      for (const item of purchase.items) {
        const inventoryItem = await InventoryItem.findById(item.item);
        inventoryItem.quantity += item.quantity;
        inventoryItem.totalValue = inventoryItem.quantity * inventoryItem.unitPrice;
        await inventoryItem.save();
      }
    }
    
    res.status(201).json(purchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

