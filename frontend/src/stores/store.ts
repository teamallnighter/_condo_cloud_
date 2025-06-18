import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';
import openAiSlice from './openAiSlice';

import usersSlice from './users/usersSlice';
import budgetsSlice from './budgets/budgetsSlice';
import documentsSlice from './documents/documentsSlice';
import maintenance_requestsSlice from './maintenance_requests/maintenance_requestsSlice';
import noticesSlice from './notices/noticesSlice';
import unitsSlice from './units/unitsSlice';
import rolesSlice from './roles/rolesSlice';
import permissionsSlice from './permissions/permissionsSlice';

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,
    openAi: openAiSlice,

    users: usersSlice,
    budgets: budgetsSlice,
    documents: documentsSlice,
    maintenance_requests: maintenance_requestsSlice,
    notices: noticesSlice,
    units: unitsSlice,
    roles: rolesSlice,
    permissions: permissionsSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
