import { useEffect, useState } from "react";
import api from '../components/axios';
import { toast , ToastContainer} from 'react-toastify';
import HeaderAdmin from './../components/Headers/HeaderAdmin';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalBookings: 0, revenue: 0 });
  const [admin,setAdmin] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/admin/dashboard");
        setAdmin(res.data.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div >
      <HeaderAdmin photoUrl={admin?.avatar}/>
      <ToastContainer position="top-right" autoClose={3000} />
      
      
    </div>
  );
}