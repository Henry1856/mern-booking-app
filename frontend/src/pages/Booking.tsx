// import { useQuery } from "@tanstack/react-query";
// import * as apiClient from "../api-client";
// import BookingForm from "../forms/BookingForm/BookingForm";
// import { useSearchContext } from "../contexts/searchContext";
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import BookingDetailsSummary from "../components/BookingDetailsSummary";
// import PaystackPop from "@paystack/inline-js";


// const Booking = () => {
//     const search = useSearchContext();
//     const {hotelId}= useParams();
//     const [numberOfNight, setNumberOfNight] = useState<number>(0);

//     useEffect(()=>{
//         if(search.checkIn && search.checkOut){
//             const nights = Math.abs(search.checkOut.getTime()- search.checkIn.getTime()) / 
//             (1000 * 60 * 60 * 24)

//             setNumberOfNight(Math.ceil(nights))
//         }
//     }, [search.checkIn, search.checkOut]);

//     const {data: paymentIntent} = useQuery({
//       queryKey:["createPaymentIntent"],
//       queryFn:()=> apiClient.createPaymentIntent(hotelId as string, numberOfNight.toString()),
//       enabled:!!hotelId && numberOfNight > 0,
//     });


//     const {data:hotel} = useQuery({
//         queryKey:["fetchHotelById"],
//         queryFn:()=> apiClient.fetchHotelById(hotelId as string),
//         enabled: !!hotelId,
//     });
//   const { data: currentUser } = useQuery({
//     queryKey: ["fetchCurrentUser"],
//     queryFn: apiClient.fetchCurrentUser,
//   });
//   if(!hotel){
//     return <></>
//   }

//   return <div className="grid md:grid-cols-[1fr_2fr]">
//     <div className="bg-green-200">
//         <BookingDetailsSummary checkIn={search.checkIn} checkOut={search.checkOut} adultCount={search.adultCount} childCount={search.childCount}
//         numberOfNights={numberOfNight} hotel={hotel} />
//     </div>
//     {currentUser && paymentIntent && (
//       <BookingForm currentUser={currentUser}/>
//       )}
//   </div>
// };

// export default Booking;




import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import BookingForm, { type BookingFormData } from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/searchContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import PaystackPop from "@paystack/inline-js";

const Booking = () => {
    const search = useSearchContext();
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [numberOfNight, setNumberOfNight] = useState<number>(0);
    const [isPaying, setIsPaying] = useState(false);

    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights =
                Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
                (1000 * 60 * 60 * 24);
            setNumberOfNight(Math.max(1, Math.ceil(nights)));
        }
    }, [search.checkIn, search.checkOut]);

    const { data: currentUser } = useQuery({
        queryKey: ["fetchCurrentUser"],
        queryFn: apiClient.fetchCurrentUser,
    });

    const { data: hotel } = useQuery({
        queryKey: ["fetchHotelById", hotelId],
        queryFn: () => apiClient.fetchHotelById(hotelId as string),
        enabled: !!hotelId,
    });

    const { data: paymentIntent } = useQuery({
        queryKey: ["createPaymentIntent", hotelId, numberOfNight, currentUser?._id],
        queryFn: () =>
            apiClient.createPaymentIntent(hotelId as string, numberOfNight.toString(), {
                firstName: currentUser!.firstName,
                lastName: currentUser!.lastName,
                email: currentUser!.email,
                adultCount: search.adultCount,
                childCount: search.childCount,
                checkIn: search.checkIn!.toISOString(),
                checkOut: search.checkOut!.toISOString(),
            }),
        enabled: !!hotelId && numberOfNight > 0 && !!currentUser && !!search.checkIn && !!search.checkOut,
    });

    if (!hotel) {
        return <></>;
    }

    const handleSave = (_formData: BookingFormData) => {
        if (!paymentIntent?.accessCode || !hotelId) return;

        setIsPaying(true);
        const popup = new PaystackPop();

        popup.resumeTransaction(paymentIntent.accessCode, {
            onSuccess: async (transaction: any) => {
                try {
                    await apiClient.verifyPayment(hotelId, transaction.reference);
                    navigate(`/hotel/${hotelId}/booking/confirmation?reference=${transaction.reference}`);
                } catch (err) {
                    console.error("Verification failed:", err);
                    setIsPaying(false);
                }
            },
            onCancel: () => {
                setIsPaying(false);
            },
        });
    };

    return (
        <div className="grid md:grid-cols-[1fr_2fr]">
            <div className="bg-green-200">
                <BookingDetailsSummary
                    checkIn={search.checkIn}
                    checkOut={search.checkOut}
                    adultCount={search.adultCount}
                    childCount={search.childCount}
                    numberOfNights={numberOfNight}
                    hotel={hotel}
                />
            </div>
            {currentUser && paymentIntent && (
                <BookingForm currentUser={currentUser} onSave={handleSave} isLoading={isPaying} />
            )}
        </div>
    );
};

export default Booking;