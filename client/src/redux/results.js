import { createSlice } from "@reduxjs/toolkit";

export const answerSlice = createSlice({
    name: "results",
    initialState: {
        results: [],
        limit: null,
        skip: null,
        total: null
    },
    reducers: {
        setResults: (state, action) => {
            state.results = action.payload.results,
            state.limit = action.payload.limit,
            state.skip = action.payload.skip,
            state.total = action.payload.total
        }
    }
});

export const { setResults } = answerSlice.actions;
export default answerSlice.reducer;