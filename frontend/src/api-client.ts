import type { SignInFormData } from "./pages/SignIn";
import type {HotelSearchResponse, HotelTypes} from "../../backend/src/shared/types";

export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message || "Failed to register");
    }
};

export const signIn = async (formData: SignInFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message || "Failed to sign in");
    }
    return responseBody;
};

export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        method: "GET",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Token invalid");
    }
    return response.json(); 
};

export const signOut = async ()=>{
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`,{
        credentials:"include",
        method:"POST"
    });
    if(!response.ok){
        throw new Error("Error during signout")
    }
};


export const addMyHotel = async (hotelFormData:FormData)=>{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`,{
        method:"POST",
        credentials:"include",
        body:hotelFormData,
    });
    if(!response.ok){
        throw new Error("Failed to add hotel")
    }
    return response.json();
};

export const fetchMyHotels = async (): Promise<HotelTypes[]>=>{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`,{
        credentials:"include"
    });
    if(!response.ok){
        throw new Error ("Error fetching hotels")
    }
    return response.json();
};

export const fetchMyHotelById = async(hotelId:string): Promise<HotelTypes>=>{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`,{
        credentials:"include",
    });

    if(!response.ok){
        throw new Error ("Error fetching Hotels")
    }
    return response.json();
};


export const updateMyHotelById = async (hotelFormData:FormData)=>{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,{
        method:"PUT",
        body:hotelFormData,
        credentials:"include",
    });
    if(!response.ok){
        throw new Error("Failed t0 update Hotel")
    }
    return response.json();
};

export type SearchParams = {
    destination?:string;
    checkIn?:string;
    checkOut?:string;
    adultCount?:string;
    childCount?:string;
    page?:string;
    facilities?:string[];
    types?:string[];
    stars?:string[];
    maxPrice?: string;
    sortOptions?: string;
};
export const searchHotels = async(searchparams:SearchParams):Promise<HotelSearchResponse>=>{
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchparams.destination || "");
    queryParams.append("checkIn", searchparams.checkIn || "");
    queryParams.append("checkOut", searchparams.checkOut || "");
    queryParams.append("adultCount", searchparams.adultCount || "");
    queryParams.append("childCount", searchparams.childCount || "");
    queryParams.append("page", searchparams.page || "");
    queryParams.append("maxPrice", searchparams.maxPrice || "");
    queryParams.append ("sortOptions", searchparams.sortOptions || "");
    searchparams.facilities?.forEach((facility) => queryParams.append("facilities", facility));
    searchparams.types?.forEach((type) => queryParams.append("types", type));
    searchparams.stars?.forEach((star) => queryParams.append("stars", star));



    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`);
    if(!response.ok){
        throw new Error("Error fetchinh hotels");
    }
    return response.json();

}
            