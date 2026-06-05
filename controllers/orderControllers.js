const asyncHandler = require("../middleware/asyncHandler");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const { sendOrderEmail } = require("../utils/emailService");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
  });

  const createdOrder = await order.save();

  // Optionally populate product + variant info before returning
  const populatedOrder = await Order.findById(createdOrder._id)
    .populate("user", "name email")
    .populate("orderItems.product", "name");

  // Send email to admin after the order is created
  await sendOrderEmail(populatedOrder);

  res.status(201).json(populatedOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get order by id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email phone");

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updateOrder = await order.save();
    res.status(200).json(updateOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to deliverd
// @route   PUT /api/orders/:id/deliver
// @access  Private/admin
const updateOrderToDeliverd = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updateOrder = await order.save();

    res.status(200).json(updateOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const updateOrderToCanceled = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isCanceled = true;

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// POST /api/orders/check-stock

// POST /api/orders/check-stock
const checkStock = asyncHandler(async (req, res) => {
  const cartItems = req.body; // array of { productId, variantId, size, qty }
  console.log("cartItems", cartItems);

  if (!cartItems || !Array.isArray(cartItems)) {
    res.status(400);
    throw new Error("Invalid cart items");
  }

  const outOfStockItems = [];

  for (const item of cartItems) {
    const product = await Product.findById(item.productId);

    if (!product) {
      outOfStockItems.push({ ...item, reason: "Product not found" });
      continue;
    }

    // Product with variants
    if (item.variantId) {
      const variant = product.variants.find((v) => v._id.toString() === item.variantId);

      if (!variant) {
        outOfStockItems.push({ ...item, reason: "Variant not found" });
        continue;
      }

      const sizeObj = variant.sizes.find((s) => s.size === item.size);

      if (!sizeObj) {
        outOfStockItems.push({ ...item, reason: "Size not found" });
        continue;
      }

      if (item.qty > sizeObj.stock) {
        outOfStockItems.push({ ...item, availableStock: sizeObj.stock });
      }
    } else {
      // Product without variants
      if (item.qty > product.countInStock) {
        outOfStockItems.push({ ...item, availableStock: product.countInStock });
      }
    }
  }

  res.json({ outOfStockItems });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/admin
/* const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate("user", "name email"); // populate user, selecting only name and email
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}); */
const getOrders = asyncHandler(async (req, res) => {
  const pageSize = 5;
  const page = Number(req.query.pageNumber) || 1;

  try {
    // Total orders count
    const count = await Order.countDocuments();

    // Paginated orders for current page
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .populate("user", "name email");

    // Aggregate totals for all orders (excluding canceled)
    const totals = await Order.aggregate([
      { $match: { isCanceled: false } },
      {
        $project: {
          totalPrice: 1,
          itemsCount: { $size: "$orderItems" }, // get the number of items in each order
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          totalItems: { $sum: "$itemsCount" }, // sum items across all orders
        },
      },
    ]);

    const totalRevenue = totals[0]?.totalRevenue?.toFixed(3) || "0.000";
    const totalItems = totals[0]?.totalItems || 0;

    res.status(200).json({
      orders,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
      totalRevenue,
      totalItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

const getUserOrders = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch orders for the user by their ID
    const userOrders = await Order.find({ user: id });

    if (!userOrders) {
      // Handle case where no orders are found
      return res.status(404).json({ message: "No orders found for this user." });
    }

    // Respond with the list of orders
    res.status(200).json(userOrders);
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ message: error.message });
  }
});
// @desc    Get order stats (Delivered, Canceled, Processing)
// @route   GET /api/orders/stats
// @access  Private/admin
const getOrderStats = asyncHandler(async (req, res) => {
  try {
    const delivered = await Order.countDocuments({ isDelivered: true });
    const canceled = await Order.countDocuments({ isCanceled: true });
    const processing = await Order.countDocuments({ isDelivered: false, isCanceled: false });
    const total = await Order.countDocuments(); // total orders

    res.status(200).json({ delivered, canceled, processing, total });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch order stats");
  }
});
// @desc    Get revenue statistics
// @route   GET /api/orders/revenue
// @access  Private/admin
const getRevenueStats = asyncHandler(async (req, res) => {
  // Aggregate orders by month
  const revenue = await Order.aggregate([
    {
      $match: {
        isCanceled: false, // only consider completed or processing orders
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
    { $sort: { "_id": 1 } },
  ]);

  // Calculate total revenue
  const totalRevenue = revenue.reduce((acc, curr) => acc + curr.totalRevenue, 0);

  res.status(200).json({ monthly: revenue, totalRevenue });
});

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDeliverd,
  getOrders,
  getUserOrders,
  updateOrderToCanceled,
  checkStock,
  getOrderStats,
  getRevenueStats,
};
