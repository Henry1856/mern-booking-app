import express,{Request,Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import ConnectDB from './config/db';
import userRoutes from "./routes/users"
import authRoutes from "./routes/auth"
import cookieParser from "cookie-parser";

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

ConnectDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use("/api/users", userRoutes)
app.use("/api/auth",authRoutes)

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to mern-booking-app!" });
});
console.log('Starting server...');

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



    