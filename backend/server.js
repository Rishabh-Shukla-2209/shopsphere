import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import reviewActionRoutes from './routes/reviewActionRoutes.js'
import errorHandler from './middlewares/errorHandlerMiddleware.js'
import adminRoutes from './routes/adminRoutes.js'
import { authorizeRoles, protect } from './middlewares/authMiddleware.js'

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("API is running...");
})

app.use('/api/auth', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', protect, orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products/:id/reviews', reviewRoutes);
app.use('/api/reviews/:id', reviewActionRoutes);
app.use('/api/admin', protect, authorizeRoles("admin"), adminRoutes);

app.use((req, res, next) => {
    const error = new Error('Route not found');
    res.status(404);
    next(error);
});


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);  
})
