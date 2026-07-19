import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <div className="bg-blue-800 py-6">
        <div className="container mx-auto flex justify-between">
            <span className="text-3xl font-bold text-white tracking-tight">
              <Link to="/">MernHolidays.com</Link>
            </span>
            <span className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
              {isLoggedIn ? (
               <>
              <Link className="flex items-center px-3 font-bold text-white hover:bg-blue-600" to="/my-bookings">My Bookings</Link>
              <Link className="flex items-center px-3 font-bold text-white hover:bg-blue-600" to="/my-hotels">My Hotels</Link>
              <SignOutButton/>
              </>
              ):(<Link to="/sign-in" className="flex items-center bg-white text-blue-600
               px-3  font-bold hover:bg-gray-100 ">Sign In</Link>)}
              
            </span>
        </div>
    </div>
  );
};
export default Header;