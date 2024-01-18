import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    sentences: [],
    translatedSet: [],
    sentenceThai: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const FetchNewData = createAsyncThunk("/fetchNewData", async (arr_sentences, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:8080/findall', {
            arr_id: arr_sentences,
        }, { withCredentials: true });

        return response.data;
    } catch (error) {
        if (error.responseCheck) {
            const message = error.responseCheck.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const FetchTransSetData = createAsyncThunk("/fetchSetData", async (data_set, thunkAPI) => {
    try {
        if (data_set === null || data_set.length === 0) {
            const errorMessage = "Invalid data_set: data_set cannot be null";
            return thunkAPI.rejectWithValue(errorMessage);
        }

        const response = await axios.post('http://localhost:8080/find-translations-set', {
            arr_set: data_set,
        }, { withCredentials: true });

        return response.data;
    } catch (error) {
        if (error.responseCheck) {
            const message = error.responseCheck.data.msg;

            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const InsertNewWords = createAsyncThunk("/new-words", async (bookSentence, thunkAPI) => {
    try {
        if (bookSentence.outputText === undefined) {
            return null;
        } else {
            const response = await axios.post('http://localhost:8080/sentence', {
                sentence: bookSentence.outputText,
            }, { withCredentials: true });

            const result = await thunkAPI.dispatch(FetchNewData({ arr_sentences: response.data.result }));

            return result.payload;
        }

    } catch (error) {
        if (error.responseCheck) {
            const message = error.responseCheck.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const InsertThaiWord = createAsyncThunk('/thai-words', async (thaiNovelWord, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:8080/thaiwords', {
            thaiWord: thaiNovelWord.inputThai,
            engWordId: thaiNovelWord.engWordId,
        }, { withCredentials: true });

        // Map the response to the expected format for FetchNewData
        const formattedResponse = response.data.result.map(item => ({
            word: item.word,
            word_id: item.word_id,
            meaning: item.meaning,
        }));

        // Dispatch FetchNewData to fetch updated data after successfully inserting Thai word
        const result = await thunkAPI.dispatch(FetchNewData({ arr_sentences: formattedResponse }));

        return result.payload;
    } catch (error) {
        if (error) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const insertTextTranslated = createAsyncThunk('/translatesentence', async (translatedSentence, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:8080/translatesentence', {
            engText: translatedSentence.engSentence,
            order_word_id: translatedSentence.wordOrder,
            sentence_translate: translatedSentence.transSentence,
        });

        return response;
    } catch (error) {
        if (error) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(InsertNewWords.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(InsertNewWords.fulfilled, (state, action) => {
            state.sentences = action.payload;
            state.isLoading = false;
            state.isSuccess = true;
        });
        builder.addCase(InsertNewWords.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        builder.addCase(InsertThaiWord.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(InsertThaiWord.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
        });
        builder.addCase(InsertThaiWord.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        builder.addCase(FetchNewData.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(FetchNewData.fulfilled, (state, action) => {
            state.sentences = action.payload;
            state.isLoading = false;
            state.isSuccess = true;
        });
        builder.addCase(FetchNewData.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        builder.addCase(FetchTransSetData.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(FetchTransSetData.fulfilled, (state, action) => {
            state.translatedSet = action.payload.result;
            state.sentenceThai = action.payload.hanabi_hi;
            state.isLoading = false;
            state.isSuccess = true;
        });
        builder.addCase(FetchTransSetData.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });
    }
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;