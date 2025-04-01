import React, { useState, useEffect, useLayoutEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFormik } from "formik";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPasswordValidation } from "./validationSchema.js";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import gmailLogo from "../constants/icon.jsx";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const defaultTheme = createTheme();

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const [invalidToken, setInvalidToken] = useState(false);

  useLayoutEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_BACK_END_URL}/user/verify-token/${token}`
        );
      } catch (error) {
        setInvalidToken(true);
      }
    };

    verifyToken();
  }, [token]);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordValidation,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setSubmitting(true);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACK_END_URL}/user/reset-password/${token}`,
          {
            newPassword: values.newPassword,
          }
        );
        setStatus({ success: "Password reset successful!" });
        if (res.data.status === true) {
          navigate("/login", {
            state: { message: "Password changed successfully!" },
          });
        }
      } catch (error) {
        if (error?.response?.data?.error) {
          toast.error(error?.response?.data?.error, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "colored",
          });
          setStatus({ error: error.res.data.error });
        }
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
            Reset Password
          </Typography>
          {invalidToken ? (
            <Typography component="h2" variant="h6" color="error">
              Invalid or Expired Token
            </Typography>
          ) : (
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
                name="newPassword"
                label="New Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.newPassword &&
                  Boolean(formik.errors.newPassword)
                }
                helperText={
                  formik.touched.newPassword && formik.errors.newPassword
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowPassword((prevState) => !prevState)
                        }
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="confirm-password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() =>
                          setShowConfirmPassword((prevState) => !prevState)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
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
                Reset Password
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    style={{ textDecoration: "none" }}
                    to="/login"
                    variant="body2"
                  >
                    {"Log In"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};
export default ResetPassword;
