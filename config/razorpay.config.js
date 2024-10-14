const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const crypto = require("crypto");
dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.totalAmount) * 100,
    currency: "INR",
  };

  try {
    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("error creating order", error);
    res.status(500).json({
      success: false,
      massage: "Error creating order",
    });
  }
};

const paymentVerification = (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      res.redirect(
        `https://myntra-clone-aziz.vercel.app/paymentsuccess?reference=${razorpay_order_id}`
      );
    }

  } catch (error) {
    console.error("Error creating payment verification:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
    });
  }
};

module.exports = { checkout, paymentVerification };
