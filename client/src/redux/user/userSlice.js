import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFalure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload,
            state.loading = false,
            state.error = null
        },
        updateUserFailure:  (state, action) => {
            state.error = action.payload,
            state.loading = false
        },
        deleteUserStart: (state) => {
            state.loadig = true;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        signoutUserStart: (state) => {
            state.loadig = true;
        },
        signoutUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        signoutUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const { 
    signInFalure, signInStart, signInSuccess, 
    updateUserFailure, updateUserSuccess, updateUserStart,
    deleteUserSuccess, deleteUserFailure, deleteUserStart,
    signoutUserFailure, signoutUserStart, signoutUserSuccess
} = userSlice.actions;

export default userSlice.reducer;