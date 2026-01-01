import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';

const initialState = {
  allpastes:[]
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addToPaste: (state,action) => {
      },
    updateToPaste: (state,action) => {
      
    },
    resetAllPaste: (state,action) => {
      
    },
    removeFromPaste: (state,action) => {
      
    },
  },
})

// Action creators are generated for each case reducer function
export const {  } = userSlice.actions

export default userSlice.reducer