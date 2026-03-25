import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  isLoggedIn: boolean;
  user: any; 
}

const initialState: UserState = {
  isLoggedIn: false,
  user: {},
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.isLoggedIn = false;
      state.user = {};
    }
  },
})

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;