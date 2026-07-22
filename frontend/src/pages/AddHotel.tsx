import { useMutation } from "@tanstack/react-query";
import ManageHotelForm from "../forms/ManageHotelForms/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client"

const AddHotel = ()=>{
    const {showToast} = useAppContext()
    // const {mutate, isLoading} = useMutation(apiClient.addMyHotel, {
    //     onSuccess:()=>{
    //         showToast({message:"Hotel Saved!", type: "SUCCESS"});
    //     },
    //     onError:()=>{

    //     }
    // })
    const {mutate, isPending} = useMutation({
        mutationFn:apiClient.addMyHotel,
        onSuccess:()=>{
            showToast({type:"SUCCESS", message:"Hotel Saved!"})
        },
        onError:()=>{
            showToast({
                type:"ERROR", message:"Error Saving Hotel"
            });
        },
    });
    const handleSave =(hotelFormdata:FormData)=>{
        mutate(hotelFormdata)

    }
    return (<ManageHotelForm onSave={handleSave} isLoading ={isPending}/>)
}
export default AddHotel;