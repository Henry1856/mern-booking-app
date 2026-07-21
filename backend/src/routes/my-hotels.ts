import express, { Request, Response } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import Hotel, { HotelTypes } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator/lib/middlewares/validation-chain-builders";
const router = express.Router();

router.post("/", verifyToken, [
    body("name").notEmpty().withMessage("Hotel name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("adultCount").isInt({ min: 1 }).withMessage("Adult count must be at least 1"),
    body("childCount").isInt({ min: 0 }).withMessage("Child count must be at least 0"),
    body("facilities").notEmpty().isArray().withMessage("Facilities must be an array"),
    body("pricePerNight").isFloat({ min: 0 }).withMessage("Price per night is required and must be a positive number"),
    body("starrating").isInt({ min: 1, max: 5 }).withMessage("Star rating must be between 1 and 5"),
    body("imageUrls").isArray().withMessage("Image URLs must be an array")
],
// fileUpload({ useTempFiles: true }, 6),
 async (req: Request, res: Response) => {
    try {
        const imageFiles = req.files?.imageFiles;
        if (!imageFiles) {
            return res.status(400).json({ message: "No image files provided" });
        }

        const newHotel: HotelTypes = req.body;
        
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

        const images = Array.isArray(imageFiles) ? imageFiles : [imageFiles];

        for (const image of images as UploadedFile[]) {
            if (!allowedTypes.includes(image.mimetype)) {
                return res.status(400).json({
                    message: `Invalid image file type: ${image.name}`,
                });
            }
        }

        const uploadPromises = (images as UploadedFile[]).map((image) =>
            cloudinary.uploader.upload(image.tempFilePath, {
                folder: "hotels-images",
                invalidate: true,
                overwrite: true,
            })
        );

        const uploadResults = await Promise.all(uploadPromises);
        const imageUrls = uploadResults.map((result) => result.secure_url);

        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId; 

        const hotel = new Hotel(newHotel);
        await hotel.save(); 

        res.status(201).send(hotel);

        } catch (error) {
        console.log("Error creating hotel:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;