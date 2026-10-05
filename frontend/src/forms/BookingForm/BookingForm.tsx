// import { useForm } from "react-hook-form";
// import type { UserType } from "../../../../backend/src/shared/types"

// type props={
//     currentUser: UserType;
// }
// type BookingFormData={
//     firstName:string;
//     lastName:string;
//     email:string;
// }

// const BookingForm =({currentUser}: props)=>{
//     const {handleSubmit, register} = useForm<BookingFormData>({
//         defaultValues:{
//             firstName:currentUser.firstName,
//             lastName:currentUser.lastName,
//             email:currentUser.email
//         }
//     });

//     return (
//         <form className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
//             <span className="text-3xl font-bold">Confirm Your Details</span>
//             <div className="grid grid-cols-2 gap-6">
//                 <label className="text-gray-700 text-sm font-bold flex-1">
//                     First Name
//                     <input className="mt-1 border-rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal" 
//                     type="text"
//                     readOnly
//                     disabled
//                     {...register("firstName")}
//                     />
//                 </label>
//                  <label className="text-gray-700 text-sm font-bold flex-1">
//                     Last Name
//                     <input className="mt-1 border-rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal" 
//                     type="text"
//                     readOnly
//                     disabled
//                     {...register("lastName")}
//                     />
//                 </label>
//                  <label className="text-gray-700 text-sm font-bold flex-1">
//                     Email
//                     <input className="mt-1 border-rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal" 
//                     type="text"
//                     readOnly
//                     disabled
//                     {...register("email")}
//                     />
//                 </label>
//             </div>
//         </form>
//     )
// };

// export default BookingForm;

import { useForm } from "react-hook-form";
import type { UserType } from "../../../../backend/src/shared/types";

type Props = {
    currentUser: UserType;
    onSave: (formData: BookingFormData) => void;
    isLoading: boolean;
};

export type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;
};

const BookingForm = ({ currentUser, onSave, isLoading }: Props) => {
    const { handleSubmit, register } = useForm<BookingFormData>({
        defaultValues: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
        },
    });

    const onSubmit = handleSubmit((formData) => {
        onSave(formData);
    });

    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
        >
            <span className="text-3xl font-bold">Confirm Your Details</span>
            <div className="grid grid-cols-2 gap-6">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input
                        className="mt-1 border-rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("firstName")}
                    />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input
                        className="mt-1 border-rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("lastName")}
                    />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input
                        className="mt-1 border-rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("email")}
                    />
                </label>
            </div>
            <button
                disabled={isLoading}
                type="submit"
                className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? "Processing..." : "Confirm & Pay"}
            </button>
        </form>
    );
};

export default BookingForm;