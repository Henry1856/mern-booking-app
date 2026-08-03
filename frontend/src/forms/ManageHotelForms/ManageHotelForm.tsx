import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection"
import TypeSection from "./TypeSection"
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import ImagesSection from "./imagesSection";
import type { HotelTypes } from "../../../../backend/src/shared/types";
import { useEffect } from "react";

export type HotelFormData={
    name:string;
    city:string;
    country:string;
    description:string;
    type:string;
    pricePerNight:number;
    starRating:number;
    facilities:string[];
    imageFiles:FileList;
    imageUrls:string[];
    adultCount:number;
    childCount:number;
};
type props={
    hotel?:HotelTypes;
    onSave:(hotelFormData:FormData)=> void
    isLoading:boolean
}

const ManageHotelForm = ({onSave, isLoading, hotel }:props) => {
    const formsMethods = useForm<HotelFormData>()
    // to submit the form
    const {handleSubmit, reset} = formsMethods;
    //hotel:HotelTypes, reset, useEffect is for edit hotel page, it enables us to edit the hotel
    useEffect(()=>{
        reset(hotel)
    }, [hotel, reset])
    const onSubmit = handleSubmit((formDataJson:HotelFormData)=>{
        //create new form data object and call our api
        const formData = new FormData();
        if(hotel){
            formData.append("hotelId", hotel._id)
        }
        formData.append("name", formDataJson.name);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);     
        formData.append("description", formDataJson.description);         
        formData.append("type", formDataJson.type);
        formData.append("pricePerNight", formDataJson.pricePerNight.toString());
        formData.append("starRating", formDataJson.starRating.toString());
        formData.append("adultCount", formDataJson.adultCount.toString());
        formData.append("childCount", formDataJson.childCount.toString());
        formDataJson.facilities.forEach((facility)=>{
            formData.append("facilities", facility)
        });

        if(formDataJson.imageUrls) {
            formDataJson.imageUrls.forEach((url,index)=>{
                formData.append(`imageUrls[${index}]`, url)
            })
        }

        Array.from(formDataJson.imageFiles).forEach((imageFile)=>{
            formData.append(`imageFiles`, imageFile);
        });
        onSave(formData)
    });
    return(
        <FormProvider {...formsMethods}>
            <form className=" flex flex-col gap-10" onSubmit={onSubmit}>
                <DetailsSection/>
                <TypeSection/>
                <FacilitiesSection/>
                <GuestSection/>
                <ImagesSection/>
                <span className="flex justify-end ">
                    <button 
                     disabled={isLoading}
                     type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500">
                        {isLoading? "saving..." : "save"}
                    </button>
                </span>
            </form>
        </FormProvider>
    )
}
export default ManageHotelForm;