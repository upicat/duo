import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'
import appSlice from './slices/appSlice'
import authSlice from './slices/authSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    app: appSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
