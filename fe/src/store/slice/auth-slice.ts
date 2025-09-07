

import { checkToken, login, loginFacebook, loginGoogle } from "@/api/authApi";
import { clearAuth, getToken, saveAuth } from "@/libs/local-storage";
import { IUser } from "@/types/implements";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  authenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: getToken() || null,
  authenticated: false,
  loading: false,
  error: null,
};

//Login
export const doLogin = createAsyncThunk<
  { user: IUser; accessToken: string; authenticated: boolean }, // kiểu trả về khi fulfilled
  { username: string; password: string }, // kiểu tham số truyền vào
  { rejectValue: string } // kiểu reject
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const response = await login(data);
    if (!response.data) {
      return rejectWithValue("Login failed. Invalid response from server.");
    }
    const { token, user } = response.data;

    saveAuth(token, user);
    // Cookies.set("accessToken", token);

    return {
      user,
      accessToken: token,
      authenticated: true,
    };
  } catch (error) {
    // console.log("Gọi login");

    return rejectWithValue("Đăng nhập thất bại, vui lòng kiểm tra lại.");
  }
});

// login gg
export const doLoginGoogle = createAsyncThunk<
  { user: IUser; accessToken: string; authenticated: boolean },
  { idToken: string },
  { rejectValue: string }
>("auth/loginGoogle", async ({ idToken }, { rejectWithValue }) => {
  try {
    const response = await loginGoogle({ idToken });

    if (!response.data) {
      return rejectWithValue(
        "Google Login failed. Invalid response from server."
      );
    }

    const { token, user } = response.data;

    saveAuth(token, user);

    return {
      user,
      accessToken: token,
      authenticated: true,
    };
  } catch (error) {
    return rejectWithValue("Google Login failed.");
  }
});

// login gg
export const doLoginFacebook = createAsyncThunk<
  { user: IUser; accessToken: string; authenticated: boolean },
  { accessToken: string },
  { rejectValue: string }
>("auth/loginFacebook", async ({ accessToken }, { rejectWithValue }) => {
  try {
    const response = await loginFacebook({ accessToken });

    if (!response.data) {
      return rejectWithValue(
        "Facebook Login failed. Invalid response from server."
      );
    }

    const { token, user } = response.data;

    saveAuth(token, user);

    return {
      user,
      accessToken: token,
      authenticated: true,
    };
  } catch (error) {
    return rejectWithValue("Google Login failed.");
  }
});

// Check token
export const doCheckToken = createAsyncThunk<
  { valid: boolean }, // kiểu dữ liệu khi fulfilled
  void, // không cần tham số
  { rejectValue: string } // kiểu dữ liệu khi bị reject
>("auth/checkToken", async (_, { rejectWithValue }) => {
  const token = getToken(); // lấy token từ localStorage
  if (!token) return rejectWithValue("No token");

  try {
    const res = await checkToken({ token });
    const valid = res.data?.valid;

    if (!valid) {
      clearAuth();
      return rejectWithValue("Token invalid");
    }

    return {
      valid: valid,
    };
  } catch {
    clearAuth();
    return rejectWithValue("Token invalid");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      //   Cookies.set("accessToken", action.payload);
      localStorage.setItem("accessToken", action.payload);
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.authenticated = false;
      //   Cookies.remove("accessToken");
      clearAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(doLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.authenticated = action.payload.authenticated;
      })
      .addCase(doLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      .addCase(doCheckToken.fulfilled, (state, action) => {
        state.authenticated = action.payload.valid;
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          state.user = JSON.parse(savedUser);
        }
      })
      .addCase(doCheckToken.rejected, (state) => {
        state.accessToken = null;
        state.user = null;
        state.authenticated = false;
      })
      .addCase(doLoginGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doLoginGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.authenticated = action.payload.authenticated;
      })
      .addCase(doLoginGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Google login error";
      })
      .addCase(doLoginFacebook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doLoginFacebook.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.authenticated = action.payload.authenticated;
      })
      .addCase(doLoginFacebook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Facebook login error";
      });
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
