import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection"
import TypeSection from "./TypeSection"
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import ImagesSection from "./imagesSection";

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
    adultCount:number;
    childCount:number;
}

const ManageHotelForm = () => {
    const formsmethods = useForm<HotelFormData>()
    return(
        <FormProvider {...formsmethods}>
            <form className=" flex flex-col gap-10">
                <DetailsSection/>
                <TypeSection/>
                <FacilitiesSection/>
                <GuestSection/>
                <ImagesSection/>
                <span className="flex justify-end ">
                    <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">Save</button>
                </span>
            </form>
        </FormProvider>
    )
}
export default ManageHotelForm;