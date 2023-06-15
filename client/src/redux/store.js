import authReducer from './auth';
import surveyReducer from './survey';
import resultsReducer from './results';
import { configureStore } from '@reduxjs/toolkit';

export default configureStore({
    reducer: {
        auth: authReducer,
        survey: surveyReducer,
        results: resultsReducer
    }
});