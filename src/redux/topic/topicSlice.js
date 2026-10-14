import { createSlice } from "@reduxjs/toolkit"
import { getTicketTopic } from "./topicThunk";

const initialState = {
    topicResponse: {
        loading: true,
        status: "pending",
        data: [],
        error: {},
    },
}

const topicSlice = createSlice({
    name: "topic",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getTicketTopic.pending, (state) => {
                state.action = {
                    topicResponse: {
                        loading: true,
                        status: "pending",
                        data: [],
                    }
                };
            })
            .addCase(getTicketTopic.fulfilled, (state, action) => {
                const list = action;
                state.action = {
                    topicResponse: {
                        loading: false,
                        status: "fulfilled",
                        data: list,
                    }
                };
            })
            .addCase(getTicketTopic.rejected, (state, action) => {
                state.topicResponse = {
                    topicResponse: {
                        loading: false,
                        status: "rejected",
                        error: action.payload,
                    }
                };
            })
    }
});

export const topicAction = topicSlice.actions;
export default topicSlice.reducer;