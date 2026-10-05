import  express, {Request, Response} from "express"
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";
import { param, validationResult} from "express-validator";
import verifyToken from "../middleware/auth";
import axios from "axios";
import mongoose from "mongoose";
import { BookingType } from "../shared/types";
import User from "../models/user";

const router = express.Router();


// search for hotel
router.get("/search",async(req:Request,res:Response)=>{ 
    try{
        const query = constructSearchQuery(req.query);
        let sortOptions = {};
        switch(req.query.sortOptions) {
            case "starRating":
                sortOptions = {starRating: -1};
                break;
            case "pricePerNightAsc" :
                sortOptions = {pricePerNight: 1}
                break;
            case "pricePerNightDesc":
                sortOptions = {pricePerNight: -1};
                break;
        }
        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber -1) * pageSize

        const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);

        const total = await Hotel.countDocuments(query);

        const response:HotelSearchResponse = {
            data:hotels,
            pagination:{
                total,
                page:pageNumber,
                pages:Math.ceil(total/pageSize),
            },
        }
        res.json(response)
    }catch(error){
        console.log("error",error);
        res.status(500).json({meassage:"something went wrong"});
    }
});


//get hotel by id


router.get("/:id",[
    param("id").notEmpty().withMessage("Hotel ID is required")
], async(req:Request, res:Response)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    const id = req.params.id;
    try{
        const hotel = await Hotel.findById(id);
        res.json(hotel)
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Error fetching hotel"})
    }
  }
);
// const PAYSTACK_URL = "https://api.paystack.co";
// const secretKey = process.env.PAYSTACK_SECRET?.trim();

// router.post("/:hotelId/bookings/initialize-payment", verifyToken,async(req:Request, res:Response)=>{
//     const {numberOfNights} = req.body;
//     const hotelId = req.params.hotelId;
//     const hotel = await Hotel.findById(hotelId)
//     if(!hotel) {
//         return res.status(400).json({message:"hotel not found"});
//     }

//     const totalCost = hotel.pricePerNight * numberOfNights;        
//     try{ 
//         const { data } = await axios({
//         method: "post",
//         url: `${PAYSTACK_URL}/transaction/initialize`,
//         data: {
//         amount: totalCost,
//         reference: `order_${hotelId}_${Date.now()}`,
//         metadata: { hotelId, userId:req.userId },
//       },
//         headers: {
//         Authorization: `Bearer ${secretKey}`,
//         "Content-Type": "application/json",
//         "Cache-Control": "no-cache",
//       },
//     });

//     return {
//       paymentUrl: data.authorization_url,
//       reference: data.reference,
//       accessCode: data.access_code,
//     };

//     }
//     catch{ throw Object.assign(
//             new Error("payment initialization failed, please try again"), {status:500}
//      );
//     }

// })


const PAYSTACK_URL = "https://api.paystack.co";

router.post("/:hotelId/bookings/initialize-payment", verifyToken, async (req: Request, res: Response) => {
    const secretKey = process.env.PAYSTACK_SECRET?.trim();
    const { numberOfNights, firstName, lastName, email, adultCount, childCount, checkIn, checkOut } = req.body;
    const hotelId = req.params.hotelId;

    if (!numberOfNights || numberOfNights <= 0) {
        return res.status(400).json({ message: "numberOfNights is required and must be greater than 0" });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
        return res.status(400).json({ message: "hotel not found" });
    }

    const totalCost = hotel.pricePerNight * numberOfNights;
    const amountInKobo = totalCost * 100;
    const reference = `order_${hotelId}_${Date.now()}`;

    try {
        const { data } = await axios({
            method: "post",
            url: `${PAYSTACK_URL}/transaction/initialize`,
            data: {
                email,
                amount: amountInKobo,
                reference,
                callback_url: `${process.env.FRONTEND_URL}/hotel/${hotelId}/booking/confirmation`,
                metadata: {
                    hotelId,
                    userId: req.userId,
                    numberOfNights,
                    totalCost,
                    firstName,
                    lastName,
                    email,
                    adultCount,
                    childCount,
                    checkIn,
                    checkOut,
                },
            },
            headers: {
                Authorization: `Bearer ${secretKey}`,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
            },
        });

        return res.status(200).json({
            paymentUrl: data.data.authorization_url,
            reference: data.data.reference,
            accessCode: data.data.access_code,
            totalCost,
        });
    } catch (error) {
        console.log("Paystack init error:", error);
        return res.status(500).json({ message: "Payment initialization failed, please try again" });
    }
});

router.post("/:hotelId/bookings/verify-payment/:reference", verifyToken, async (req: Request, res: Response) => {
    const { hotelId } = req.params;
    const reference = req.params.reference as string;
    const secretKey = process.env.PAYSTACK_SECRET?.trim();

    try {
        const { data } = await axios({
            method: "get",
            url: `${PAYSTACK_URL}/transaction/verify/${reference}`,
            headers: {
                Authorization: `Bearer ${secretKey}`,
            },
        });

        const transaction = data.data;

        if (transaction.status !== "success") {
            return res.status(400).json({ message: `Payment was not successful: ${transaction.status}` });
        }

        if (
            transaction.metadata?.hotelId !== hotelId ||
            transaction.metadata?.userId !== req.userId
        ) {
            return res.status(400).json({ message: "Transaction does not match this booking request" });
        }

        const existingHotel = await Hotel.findById(hotelId);
        if (!existingHotel) {
            return res.status(400).json({ message: "Hotel not found" });
        }

        const alreadyBooked = existingHotel.bookings.some(
            (booking) => booking.paymentReference === reference
        );
        if (alreadyBooked) {
            return res.status(200).json({ message: "Booking already confirmed" });
        }

        const { firstName, lastName, email, adultCount, childCount, checkIn, checkOut, totalCost } = transaction.metadata;

        const newBooking: BookingType = {
            _id: new mongoose.Types.ObjectId().toString(),
            userId: req.userId,
            firstName,
            lastName,
            email,
            adultCount,
            childCount,
            checkIn,
            checkOut,
            totalCost,
            paymentReference: reference,
        };

        const hotel = await Hotel.findOneAndUpdate(
            { _id: hotelId },
            { $push: { bookings: newBooking } },
            { new: true }
        );

        if (!hotel) {
            return res.status(400).json({ message: "Hotel not found" });
        }

        return res.status(200).json({ message: "Booking confirmed successfully" });
    } catch (error) {
        console.log("Paystack verify error:", error);
        return res.status(500).json({ message: "Payment verification failed" });
    }
});


const constructSearchQuery =(queryParams:any)=>{
    let constructedQuery:any = {};
    if(queryParams.destination){
        constructedQuery.$or = [
            {city:new RegExp(queryParams.destination, "i")},
            {country: new RegExp(queryParams.destination, "i")}
        ];
    }
    if(queryParams.adultCount){
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }
    if(queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }
    if(queryParams.facilities) {
        constructedQuery.facilities = {
            $all:Array.isArray(queryParams.facilities) ? queryParams.facilities : [queryParams.facilities]
        };
    }

    if(queryParams.types) {
        constructedQuery.type ={
            $in: Array.isArray(queryParams.typs) ? queryParams.types : [queryParams.types]
        };
    }

    if(queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars)
        ? queryParams.stars.map((star:string) => parseInt(star))
        : parseInt(queryParams.stars);
        constructedQuery.starRating = {
            $in:starRatings
        };
    }

    if(queryParams.maxPrice){
        constructedQuery.pricePerNight = {
            $lte:parseInt(queryParams.maxPrice).toString(),
        };
    }
    return constructedQuery;
};
export default  router;