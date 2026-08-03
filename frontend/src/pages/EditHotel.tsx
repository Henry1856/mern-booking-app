import { useMutation, useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import * as apiClient from "../api-client"
import ManageHotelForm from "../forms/ManageHotelForms/ManageHotelForm"
import { useAppContext } from "../contexts/AppContext"

const EditHotel =()=>{
    const {hotelId} = useParams()
    const {showToast}= useAppContext();


    const {data : hotel} = useQuery({
        queryKey:["fetchMyHotelById",hotelId],
        queryFn:()=> apiClient.fetchMyHotelById(hotelId || ""),
        enabled:!! hotelId,

    });

    const {mutate, isPending} = useMutation({
        mutationFn: apiClient.updateMyHotelById,
        onSuccess:()=>{
            showToast({type:"SUCCESS", message:"Hotel updated successfully"}) 
        },
        onError:()=>{
            showToast({type:"ERROR", message:"fail to update hotel"})
        }
    })

    const handleSave =(hotelFormData:FormData)=>{
        mutate(hotelFormData);
    }
    // return null;
    return <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isPending}/>
}

export default EditHotel;