import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import LocationsList from "./pages/locations/LocationsList";
import LocationsCreate from "./pages/locations/LocationsCreate";
import LocationsEdit from "./pages/locations/LocationsEdit";

import RoomsList from "./pages/rooms/RoomsList";
import RoomsCreate from "./pages/rooms/RoomsCreate";
import RoomsEdit from "./pages/rooms/RoomsEdit";

import ReservationsList from "./pages/reservations/ReservationsList";
import ReservationsCreate from "./pages/reservations/ReservationsCreate";
import ReservationsEdit from "./pages/reservations/ReservationsEdit";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* LOCATIONS */}
      <Route path="/locations">
        <Route index element={<LocationsList />} />
        <Route path="create" element={<LocationsCreate />} />
        <Route path="edit/:id" element={<LocationsEdit />} />
      </Route>

      {/* ROOMS */}
      <Route path="/rooms">
        <Route index element={<RoomsList />} />
        <Route path="create" element={<RoomsCreate />} />
        <Route path="edit/:id" element={<RoomsEdit />} />
      </Route>

      {/* RESERVATIONS */}
      <Route path="/reservations">
        <Route index element={<ReservationsList />} />
        <Route path="create" element={<ReservationsCreate />} />
        <Route path="edit/:id" element={<ReservationsEdit />} />
      </Route>
      
    </Routes>
  );
}

export default App;
