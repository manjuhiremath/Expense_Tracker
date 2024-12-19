import Razorpay from 'razorpay';
import { Orders } from '../models/orders.js';

export const purchasePremium = (req, res) => {
    const rsp = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET
    });

    const amount = 30000; // 300 INR in paise

    rsp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
        if (err) {
            console.error('Error creating Razorpay order:', err);
            return res.status(500).json({ error: 'Error creating order with Razorpay' });
        }

        if (!order) {
            console.error('No order returned from Razorpay');
            return res.status(500).json({ error: 'Failed to create Razorpay order' });
        }

        const orderid = order.id; // Order ID returned from Razorpay
        // console.log('Order ID:', orderid);

        if (req.user) {
            try {
                // Create an order associated with the authenticated user in your database
                await req.user.createOrder({
                    orderid: orderid,
                    status: 'PENDING',
                    amount: amount,
                    // paymentid:
                });

                // Send the order and Razorpay key_id to the frontend
                return res.status(201).json({
                    order,
                    key_id: rsp.key_id // Send Razorpay key ID to frontend
                });
            } catch (err) {
                console.error('Error saving order to the database:', err);
                return res.status(500).json({ error: 'Error saving order in database' });
            }
        } else {
            // If no user is authenticated, return an error
            return res.status(401).json({ error: 'User not authenticated' });
        }
    });
};

export const updateTransaction = async (req, res) => {
    try {
        const { orderid, paymentid } = req.body;
        console.log(paymentid, orderid);

        // Find the order using the orderid
        const order = await Orders.findOne({ where: { orderid: orderid } });

        // If the order is not found, return an error
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found!' });
        }

        // Update the order with the payment id and status
        order.paymentid = paymentid;
        order.status = 'SUCCESSFUL'; // Update the status to successful
        await order.save(); // Save the updated order

        // Update the user to mark them as a premium user
        const user = await req.user.update({ isPremium: true });

        // Return success response
        return res.status(202).json({ success: true, message: 'Transaction Successful!' });
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err.message });
    }
};



