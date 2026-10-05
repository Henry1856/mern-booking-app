import { useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import * as apiClient from "../api-client";

const BookingConfirmation = () => {
    const { hotelId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const reference = searchParams.get("reference") || searchParams.get("trxref");

        if (!hotelId || !reference) {
            setStatus("error");
            setMessage("Missing booking reference.");
            return;
        }

        apiClient
            .verifyPayment(hotelId, reference)
            .then(() => setStatus("success"))
            .catch((err) => {
                console.error("Verification failed:", err);
                setStatus("error");
                setMessage("We couldn't verify your payment. Please contact support.");
            });
    }, [hotelId, searchParams]);

    return (
        <div className="max-w-xl mx-auto mt-10 text-center">
            {status === "verifying" && <p className="text-lg">Verifying your payment...</p>}
            {status === "success" && (
                <div className="text-green-600">
                    <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                    <p>Your payment was successful and your booking is confirmed.</p>
                    <button onClick={() => navigate("/")} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                        Back to Home
                    </button>
                </div>
            )}
            {status === "error" && (
                <div className="text-red-600">
                    <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
};

export default BookingConfirmation;