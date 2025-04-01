import React, { useEffect, useState } from "react";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFormik } from "formik";
import { signInValidation } from "./validationSchema";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import gmailLogo from "../constants/icon";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../Auth/AuthContext";

const defaultTheme = createTheme();

const UserLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signInValidation,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setSubmitting(true);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACK_END_URL}/user/login`,
          values
        );

        if (res.data.status === true) {
          await login({
            token: res?.data?.token,
            refreshToken: res?.data?.refreshToken,
          });

          navigate("/", { replace: true });
        } else {
          setStatus({ error: res?.data?.error });
          toast.error(res.data.error, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "colored",
          });
        }
      } catch (error) {
        setStatus({
          error: error.response?.data?.error || "An error occurred",
        });
        toast.error(error.response?.data?.error || "An error occurred", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "colored",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });
  useEffect(() => {
    const hasLoggedOut = localStorage.getItem("hasLoggedOut");
    if (hasLoggedOut) {
      toast.warn("Logged out Successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      });
      localStorage.removeItem("hasLoggedOut", "false");
    }
    if (location.state?.message) {
      toast.success(location.state.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Container component="main" maxWidth="xs">
            <ToastContainer />
            <CssBaseline />
            <Box
              sx={{
                marginTop: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: "white",
                  width: "70px",
                  height: "70px",
                }}
              >
                {/* <LockOutlinedIcon /> */}
                <img src={gmailLogo} style={{ width: "60px" }} />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="email"
                  label="Email Address"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() =>
                          setShowPassword((prevState) => !prevState)
                        }
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={formik.isSubmitting}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <NavLink
                      style={{ textDecoration: "none" }}
                      to="/forget-password"
                      variant="body2"
                    >
                      Forgot password?
                    </NavLink>
                  </Grid>
                  <Grid item>
                    <NavLink
                      style={{ textDecoration: "none" }}
                      to="/register"
                      variant="body2"
                    >
                      {"Don't have an account? Sign Up"}
                    </NavLink>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default UserLogin;
