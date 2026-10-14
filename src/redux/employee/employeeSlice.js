import { createSlice } from "@reduxjs/toolkit"
import { getEmployeeProfile } from "./employeeThunk";

const initialState = {
    employeeResponse: {
        loading: true,
        status: "pending",
        data: [],
        error: {},
    },
}

const employeeSlice = createSlice({
    name: "employee",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getEmployeeProfile.pending, (state) => {
                state.action = {
                    employeeResponse: {
                        loading: true,
                        status: "pending",
                        data: [],
                    }
                };
            })
            .addCase(getEmployeeProfile.fulfilled, (state, action) => {
                const list = action;
                state.action = {
                    employeeResponse: {
                        loading: false,
                        status: "fulfilled",
                        data: list,
                    }
                };
            })
            .addCase(getEmployeeProfile.rejected, (state, action) => {
                state.employeeResponse = {
                    employeeResponse: {
                        loading: false,
                        status: "rejected",
                        error: action.payload,
                    }
                };
            })
    }
});

export const employeeAction = employeeSlice.actions;
export default employeeSlice.reducer;