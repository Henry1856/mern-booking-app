import { useQuery } from "@tanstack/react-query";
import { useSearchContext } from "../contexts/searchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultCard from "../components/SearchResultCard";
import Pagination from "../components/pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import HotelFacilitiesFilter from "../components/HotelFacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = ()=>{
    const [page,setPage] = useState<number>(1)
    const search = useSearchContext();
    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
    const [selectedHotelFacilities, setSelectedHotelFacilities] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
    const [sortOptions, setSortOption] = useState<string>("")


    const searchParams = {
        destination:search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut:search.checkOut.toISOString(),
        adultCount:search.adultCount.toString(),
        childCount:search.childCount.toString(),
        page:page.toString(),
        stars:selectedStars,
        types:selectedHotelTypes,
        facilities:selectedHotelFacilities,
        maxPrice:selectedPrice?.toString(),
        sortOptions,

    };

    const {data:hotelData} = useQuery({
        queryKey:["searchHotels", searchParams],
        queryFn:()=>apiClient.searchHotels(searchParams)
    });
    const handleStarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const starRating = event.target.value;
        setSelectedStars((prevStars)=>
            event.target.checked
            ? [...prevStars, starRating]
            : prevStars.filter((star) => star !== starRating)
        )
           
    };

     const handleHotelTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const hotelType = event.target.value;
        setSelectedHotelTypes((prevHotel)=>
            event.target.checked
            ? [...prevHotel, hotelType]
            : prevHotel.filter((hotel) => hotel !== hotelType)
        )       
    };

     const handleHotelfacilitiesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const hotelFacilities = event.target.value;
        setSelectedHotelFacilities((prevHotel)=>
            event.target.checked
            ? [...prevHotel, hotelFacilities]
            : prevHotel.filter((hotel) => hotel !== hotelFacilities)
        )       
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
            <div className="rounded-lg border border-slate-300 p-5 h-fit lg:sticky lg:top-10">
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold border-b border-slate-300 pb-5"> Filter by:</h3>
                    <StarRatingFilter selectedStars={selectedStars} onChange={handleStarChange}/>
                    <HotelTypesFilter selectedHotelTypes={selectedHotelTypes} onChange={handleHotelTypeChange}/>
                    <HotelFacilitiesFilter selectedHotelFacilities={selectedHotelFacilities} onChange={handleHotelfacilitiesChange}/>
                    <PriceFilter selectedPrice={selectedPrice} onChange={(value?:number)=>setSelectedPrice(value)}/>
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {hotelData?.pagination.total} Hotels found
                        {search.destination ? `  in ${search.destination}` : ""}
                    </span>
                    <select value ={sortOptions}
                    onChange={(event)=>setSortOption(event.target.value)}
                    className="p-2 border rounded-md"
                    >
                        <option value="">Sort By</option>
                        <option value="starRating">Star Rating</option>
                        <option value="pricePerNightAsc">Price Per Night (low to high)</option>
                        <option value="pricePerNightDesc">Price Per Night (high to low)</option>


                        
                    </select>
                </div>
                {hotelData?.data.map((hotel)=>(
                    <SearchResultCard hotel = {hotel}/>
                ))}
                <div>
                    <Pagination page={hotelData?.pagination.page  || 1}
                     pages ={hotelData?.pagination.pages || 1}
                     onPageChange={(page) => setPage(page)}  />
                </div>
            </div>
        </div>
    );
};
export default Search;