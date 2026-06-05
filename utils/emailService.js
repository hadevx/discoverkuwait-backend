const nodemailer = require("nodemailer");
const User = require("../models/userModel");

// Create a transporter object with SMTP server details
const transporter = nodemailer.createTransport({
  service: "gmail", // or use your SMTP service provider
  auth: {
    user: process.env.CUSTOMER_SERVICE_EMAIL, // Your email address (environment variable)
    pass: process.env.CUSTOMER_SERVICE_PASS, // Your email password (environment variable)
  },
});

// Function to send email
const sendOrderEmail = async (orderDetails) => {
  const user = await User.findById(orderDetails.user);

  const mailOptions = {
    from: process.env.CUSTOMER_SERVICE_EMAIL,
    to: process.env.ADMIN_EMAIL, // Send the email to the admin
    subject: "You've got a new order",
    html: `<h1>You Have New Order</h1>
           <p>Order ID: <strong>${orderDetails?._id}</strong></p>
           <p>Total Price: <strong>${orderDetails.totalPrice.toFixed(3)} KD</strong> </p>
           <p>Customer: <strong>${user.name}</strong></p>
           <p>Email: <strong>${user.email}</strong></p>
           <p>Phone: <strong>${user.phone}</strong></p>
           <p>Province: <strong>${orderDetails.shippingAddress.governorate}</strong></p>
           <p>City: <strong>${orderDetails.shippingAddress.city}</strong></p>
           <p>Block: <strong>${orderDetails.shippingAddress.block}</strong></p>
           <p>Street: <strong>${orderDetails.shippingAddress.street}</strong></p>
           <p>House: <strong>${orderDetails.shippingAddress.house}</strong></p>
           <h2>Order Items</h2>
         <table style="width: 100%; border-collapse: collapse;">
           <thead>
             <tr>
               <th style="border: 1px solid black; padding: 8px;">Product Name</th>
               <th style="border: 1px solid black; padding: 8px;">Quantity</th>
               <th style="border: 1px solid black; padding: 8px;">Price</th>
               <th style="border: 1px solid black; padding: 8px;">Total</th>
             </tr>
           </thead>
           <tbody>
             ${orderDetails.orderItems
               .map(
                 (item) => `
               <tr>
                 <td style="border: 1px solid black; padding: 8px;">${item.name}</td>
                 <td style="border: 1px solid black; padding: 8px;">${item.qty}</td>
                 <td style="border: 1px solid black; padding: 8px;">${item.price.toFixed(3)} KD</td>
                 <td style="border: 1px solid black; padding: 8px;">${(
                   item.price * item.qty
                 ).toFixed(3)} KD</td>
               </tr>`
               )
               .join("")}
           </tbody>
         </table>`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendRestPasswordEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CUSTOMER_SERVICE_EMAIL,
      pass: process.env.CUSTOMER_SERVICE_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.CUSTOMER_SERVICE_EMAIL,
    to,
    subject,
    text,
  });
};
module.exports = { sendOrderEmail, sendRestPasswordEmail };
