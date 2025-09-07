import { createBrowserRouter} from 'react-router-dom'
import BeforeLoginUser from '../pages/BeforeLoginUser';
import UserRegistration from '../pages/UserRegistration';
import UserHome from './../pages/UserHome';
import ProfilePage from './../pages/Profile';
import VehiclePage from '../pages/Vehicle';
import AdminDashboard from '../pages/AdminDashboard';
import AdminParkingSlots from '../pages/AdminParkingSlots';
import UserBookings from '../pages/UserBookings';

const userRouter = createBrowserRouter(
  [
    {
      path:"/",
      element:
        <div>
            <BeforeLoginUser/>
        </div>,
    },
    {
      path:"/login",
      element:
        <div>
            <BeforeLoginUser/>
        </div>,
    },
    {
      path:"/register",
      element:
        <div>
            <UserRegistration/>
        </div>,
    },
    {
      path:"/user",
      element:
        <div>
            <UserHome/>
        </div>,
    },
    {
      path:"/profile",
      element:
        <div>
            <ProfilePage/>
        </div>,
    },
    {
      path:"/vehicle",
      element:
        <div>
            <VehiclePage/>
        </div>,
    },
    {
      path:"/bookings",
      element:
        <div>
            <UserBookings/>
        </div>,
    },
    {
      path:"/admin",
      element:
        <div>
            <AdminDashboard/>
        </div>,
    },
    {
      path:"/admin/manageslots",
      element:
        <div>
            <AdminParkingSlots/>
        </div>,
    },
    
    
  ]
)

export default userRouter