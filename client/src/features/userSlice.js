import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: null,
	pageLoading : true
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, actions) => {
			state.user = actions.payload;
		},
		setPageLoading: (state, actions) => {
			state.pageLoading = actions.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setUser, setPageLoading} = userSlice.actions;

export default userSlice.reducer;
