const createPayment = async (req, res) => {
  try {
    const { amount, customer } = req.body;

    const tapBody = {
      amount,
      currency: "KWD", // Change if needed
      threeDSecure: true,
      save_card: false,
      description: "Order Payment",
      statement_descriptor: "My Store",
      customer: {
        first_name: customer.firstName,
        email: customer.email,
        phone: {
          country_code: "965",
          number: customer.phone,
        },
      },
      source: {
        id: "src_all",
      },
      redirect: {
        url: "http://localhost:5173/payment/callback", // frontend redirect
      },
    };

    const response = await fetch("https://api.tap.company/v2/charges", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tapBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Tap API error:", errorData);
      return res
        .status(response.status)
        .json({ error: "Payment creation failed", details: errorData });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Payment route error:", err);
    res.status(500).json({ error: "Payment creation failed" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { tapId } = req.params;

    const response = await fetch(`https://api.tap.company/v2/charges/${tapId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Tap API verify error:", errorData);
      return res
        .status(response.status)
        .json({ error: "Payment verification failed", details: errorData });
    }

    const charge = await response.json();

    if (charge.status === "CAPTURED") {
      // Here you could create/update the order in DB
      return res.json({
        status: "success",
        tapCharge: charge,
        orderId: charge.metadata?.order_id || null, // assuming you passed order_id in metadata
      });
    } else {
      return res.json({ status: "failed", tapCharge: charge });
    }
  } catch (err) {
    console.error("Payment verification route error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

module.exports = { createPayment, verifyPayment };
