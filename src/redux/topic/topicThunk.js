import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIServices } from "../../hooks/fetchAPI";

import ObjectDeserializer from "../../utils/object-to-params";

export const getTicketTopic = createAsyncThunk(
    'get/ticket/topic',
    async (value, thunkApi) => {
        try {

            const { objectToParams } = ObjectDeserializer;

            const response = await APIServices.get({ url: `/ticket-topic/get-ticket-topic?${objectToParams(value)}` });
            return response.data.data;
            
        } catch (error) {
            return thunkApi.rejectWithValue({ error: error.data, status: error.status });
        }
    }
)