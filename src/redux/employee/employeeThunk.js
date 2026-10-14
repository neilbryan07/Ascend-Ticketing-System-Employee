import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIServices } from "../../hooks/fetchAPI";

export const getEmployeeProfile = createAsyncThunk(
    'get/employee/profile',
    async (value, thunkApi) => {
        try {

            const response = await APIServices.get({ url: '/employee-module/get-employee' });
            return response.data.data;
            
        } catch (error) {
            return thunkApi.rejectWithValue({ error: error.data, status: error.status });
        }
    }
)