import './App.css'
import { RouterProvider } from 'react-router-dom'
import userRouter from './router/userrouter.jsx'
//import { UserProvider } from './components/UserContext.jsx'


function App() {
  return (
    <div >
      {/* <UserProvider> */}
        <RouterProvider router={userRouter} />
        

      {/* </UserProvider> */}
      
    </div>
  )
}

export default App
