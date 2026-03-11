import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	allUsers: null,
};

export const allUserSlice = createSlice({
	name: "allUsers",
	initialState,
	reducers: {
		setAllUsers: (state, actions) => {
			state.allUsers = actions.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setAllUsers } = allUserSlice.actions;

export default allUserSlice.reducer;
