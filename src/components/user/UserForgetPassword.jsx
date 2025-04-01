import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFormik } from "formik";
import { forgetPasswordvalidation } from "./validationSchema";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import gmailLogo from "../constants/icon";
const defaultTheme = createTheme();

const UserForgetPassword = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgetPasswordvalidation,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setSubmitting(true);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACK_END_URL}/user/forgot-password`,
          {
            email: values.email,
          }
        );
        if (res.data.status === true) {
          navigate("/login", {
            state: { message: "Reset link sent successfully!" },
          });
        }
        setStatus({ success: "Link sent to email successful!" });
      } catch (error) {
        toast.error(error.response?.data?.error || "An error occurred", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "colored",
        });
        console.log(error);
        setStatus({ error: error.response?.data?.error });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <ToastContainer />
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
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
            <img src={gmailLogo} style={{ width: "60px" }} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forget Password
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={formik.isSubmitting}
            >
              Send Link to Email
            </Button>
            <Grid container>
              <Grid item xs>
                <NavLink
                  style={{ textDecoration: "none" }}
                  to="/login"
                  variant="body2"
                >
                  {"Log In"}
                </NavLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default UserForgetPassword;
