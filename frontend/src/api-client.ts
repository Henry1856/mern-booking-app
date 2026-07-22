import type { SignInFormData } from "./pages/SignIn";

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
    const response = await fetch(`${API_BASE_URL}/api/my-hotel`,{
        method:"POST",
        credentials:"include",
        body:hotelFormData,
    });
    if(!response.ok){
        throw new Error("Failed to add hotel")
    }
    return response.json();
};
            