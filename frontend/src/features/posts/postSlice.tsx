import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import produce from "immer";
import { RootState } from "../../app/store";
import { fetchPosts, createPost, destroyPost } from "./postsAPI";

export enum Statuses {
  Initial = "Not Fetched",
  Loading = "Loading...",
  UpToDate = "Up To Date",
  Deleted = "Deleted",
  Error = "Error"
}

export interface PostState {
  id?: number;
  title?: string;
  body?: string;
  created_at?: any;
  updated_at?: any;
}

export interface PostsState {
  posts: PostState[];
  status: string;
}

export interface PostFormData {
  post: {
    id?: string;
    title: string;
    body: string;
  }
}

export interface PostDeleteData {
  post: {
    post_id: number;
  }
}

export interface PostUpdateData {
  post_id: number;
  post: PostState;
}

const initialState: PostsState = {
  posts: [
    {
      id: 0,
      title: "",
      body: "",
      created_at: "",
      updated_at: ""
    }
  ],
  status: Statuses.Initial
}

export const fetchPostsAsync = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const response = await fetchPosts();
    return response;
  }
)

export const createPostAsync = createAsyncThunk(
  'posts/createPost',
  async (payload: PostFormData) => {
    const response = await createPost(payload);

    return response;
  }
)

export const destroyPostAsync = createAsyncThunk(
  'posts/destroyPost',
  async (payload: PostDeleteData) => {
    const response = await destroyPost(payload);

    return response;
  }
)

export const postSlice = createSlice({
  name: "posts",
  initialState,
  /**
   * Sync actions.
   */
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCHING POSTS SECTION

      // Waiting to fetch posts data
      .addCase(fetchPostsAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        })
      })

      // Fetched data complete
      .addCase(fetchPostsAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.posts = action.payload;
          draftState.status = Statuses.UpToDate;
        })
      })

      // Error occurred while fetching data
      .addCase(fetchPostsAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        })
      })

      // CREATE POST SECTION

      // Waiting to create post
      .addCase(createPostAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        })
      })

      // Create post complete
      .addCase(createPostAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.posts.push(action.payload);
          draftState.status = Statuses.UpToDate;
        })
      })

      // Error occurred while creating a post
      .addCase(createPostAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        })
      })

      // DELETE POST SECTION

      // Waiting to delete post
      .addCase(destroyPostAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        })
      })

      // Delete post complete
      .addCase(destroyPostAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.posts = action.payload;
          draftState.status = Statuses.UpToDate;
        })
      })

      // Error occurred while deleting a post
      .addCase(destroyPostAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        })
      })
  }
})

export const {  } = postSlice.actions;

export const selectPosts = (state: RootState) => state.posts.posts;

export const selectStatus = (state: RootState) => state.posts.status;

export default postSlice.reducer;
