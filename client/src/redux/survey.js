import { createSlice } from "@reduxjs/toolkit";

export const surveySlice = createSlice({
    name: "survey",
    initialState: {
        surveys: [],
        currSurvey: {
            id: null,
            value: "",
            survey: null
        },
        total: null,
        limit: null,
        skip: null
    },
    reducers: {
        setSurveys: (state, action) => {
            state.surveys = action.payload.surveys;
            state.limit = action.payload.limit;
            state.total = action.payload.total;
            state.skip = action.payload.skip;
        },
        setCurrSurvey: (state, action) => {
            state.currSurvey = action.payload.currSurvey
        }
    }
});

export const { setSurveys, setCurrSurvey} = surveySlice.actions;
export default surveySlice.reducer;