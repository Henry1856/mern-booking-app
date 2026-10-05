
import {  Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Details from "./pages/Details";
import Booking from "./pages/Booking";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/myBookings";


const App = () => {
  const{isLoggedIn} = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout>
          <p>Home page</p>
        </Layout>} />
        <Route path="/search" element={<Layout><Search/></Layout>}/>
        <Route path="/detail/:hotelId" element={<Layout><Details/></Layout>}/>


        <Route path="/register" element={<Layout><Register /></Layout>}/>
        <Route path="/sign-in" element={<Layout><SignIn/></Layout>} />

        <Route path="/hotel/:hotelId/booking" element={<Layout>{isLoggedIn ? <Booking /> : <SignIn />}</Layout>}/>
        <Route path="/add-hotel" element={<Layout>{isLoggedIn ? <AddHotel /> : <SignIn />}</Layout>}/>
        <Route path="/My-hotels" element={<Layout>{isLoggedIn ? <MyHotels /> : <SignIn />}</Layout>}/>
        <Route path="/My-bookings" element={<Layout>{isLoggedIn ? <MyBookings /> : <SignIn />}</Layout>}/>
        <Route path="my-hotels/edit-hotels/:hotelId" element={<Layout>{isLoggedIn ? <EditHotel /> : <SignIn />}</Layout>}/>
        <Route path="/hotel/:hotelId/booking/confirmation" element={<Layout><BookingConfirmation /></Layout>}/>

      </Routes>
    </Router>
  );
}
export default App

