const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15*60*1000,
    max: 100
})

app.use("/api", limiter);

app.get('/', (req, res) => {
  res.json({ message: 'StreakFlow API is running 🔥' });
});

connectDB().then(()=>{
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})