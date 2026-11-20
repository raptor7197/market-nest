// Must be the first import so env vars exist before any module reads them.
import 'dotenv/config';

import app from './app.js';
import connectDB from './config/db.js';
import { cancelStalePendingOrders } from './controllers/orderController.js';

const PORT = process.env.PORT || 5000;
const PENDING_TTL_HOURS = parseInt(process.env.PENDING_ORDER_TTL_HOURS, 10) || 24;
const MAINTENANCE_INTERVAL_MS =
  (parseInt(process.env.ORDER_MAINTENANCE_INTERVAL_MINUTES, 10) || 60) * 60 * 1000;

const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Release inventory held by abandoned pending orders.
    const runMaintenance = async () => {
      try {
        const cancelled = await cancelStalePendingOrders(PENDING_TTL_HOURS);
        if (cancelled > 0) {
          console.log(`Auto-cancelled ${cancelled} stale pending order(s)`);
        }
      } catch (error) {
        console.error('Order maintenance failed:', error.message);
      }
    };
    runMaintenance();
    setInterval(runMaintenance, MAINTENANCE_INTERVAL_MS).unref();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
