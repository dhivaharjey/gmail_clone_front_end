import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { Avatar, Box, Dialog, IconButton, Typography } from "@mui/material";
import styled from "@emotion/styled";
import {
  AddAPhoto,
  AddOutlined,
  Clear,
  Close,
  Delete,
  EditOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../Auth/AuthContext";

const ProfileIcon = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { logout, authTokens } = useAuth();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const StyledButton = styled(Button)({
    padding: "10px 30px",
    border: "1px solid black",
    borderRadius: "30px",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#D4DEF7",
    },
  });

  const AccountBox = styled(Button)({
    display: "flex",
    cursor: "pointer",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "lightgrey",
    },
  });
  const fetchUserDetails = async () => {
    if (authTokens?.token) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACK_END_URL}/user/get-user-details`,
          {
            headers: {
              Authorization: `Bearer ${authTokens.token}`,
            },
          }
        );
        setUser(response.data);
        setProfileImage(response.data.profileImage);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [authTokens]);

  const handleLogOut = () => {
    setUser(null);
    setProfileImage(null);
    logout();
  };

  const handleProfileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_END_URL}/user/upload-profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authTokens.token}`,
          },
        }
      );

      setProfileImage(response.data.filePath);
      await fetchUserDetails();
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const handleDeleteProfileImage = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACK_END_URL}/user/delete-profile-image`,
        {
          headers: {
            Authorization: `Bearer ${authTokens.token}`,
          },
        }
      );

      if (response.data.status) {
        setProfileImage(null);

        await fetchUserDetails();
      } else {
        console.error("Failed to delete profile image:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting profile image:", error);
    }
  };

  const imageUrl = profileImage
    ? `${process.env.REACT_APP_BACK_END_URL}/${profileImage}?t=${Date.now()}`
    : user?.userName?.charAt(0);
  // console.log(imageUrl);
  return (
    <>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Avatar
          fontSize="small"
          sx={{
            display: { xs: "flex", sm: "flex" },
            width: "30px",
            height: "30px",
          }}
          src={imageUrl}
        >
          {!profileImage && user?.userName?.charAt(0)}
        </Avatar>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "300px", sm: "400px" },
              height: { xs: "450px", sm: "360px" },
              backgroundColor: "#DFEAF0",
              borderRadius: "30px",
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              marginTop: "5px",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            margin: "7px",
          }}
        >
          <Typography>{user?.email || "example@gmail.com"}</Typography>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: "10px", top: "7px" }}
          >
            <Clear />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "12px",
            position: "relative",
          }}
        >
          <Avatar
            sx={{ width: "90px", height: "90px" }}
            src={imageUrl}
            alt="Profile"
            onClick={() => setOpenDialog(true)}
          >
            {!profileImage && user?.userName?.charAt(0)}
          </Avatar>
          <EditOutlined
            sx={{
              position: "absolute",
              bottom: "12px",
              right: "145px",
              padding: "2px",
              backgroundColor: "white",
              borderRadius: "15px",
            }}
            onClick={() => setOpenDialog(true)}
          />
        </Box>
        <Typography
          sx={{ textAlign: "center", fontSize: "25px", margin: "3px 0px" }}
        >
          Hi, {user?.userName || "New User"}!
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: { xs: "0px 10px", sm: "0px 20px" },
          }}
        >
          <StyledButton>Manage your Google Account</StyledButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: { xs: "column", sm: "row" },
            margin: "15px 0",
          }}
        >
          <AccountBox
            sx={{
              borderRadius: "30px 0px 0px 30px",
              padding: { xs: "10px 30px", sm: "0px 30px" },
              margin: { xs: "10px 0px 10px 10px", sm: "0px" },
            }}
          >
            <AddOutlined color="primary" />
            <Typography
              sx={{ color: "black", textTransform: "none", marginLeft: "12px" }}
            >
              Add account
            </Typography>
          </AccountBox>
          <AccountBox
            onClick={handleLogOut}
            sx={{
              borderRadius: "0px 30px 30px 0px",
              padding: { xs: "10px 30px", sm: "20px 40px" },
              margin: { xs: "0px 10px 20px 0", sm: "0px 0px 0px 2px" },
            }}
          >
            <LogoutOutlined color="action" />
            <Typography
              sx={{ color: "black", textTransform: "none", marginLeft: "10px" }}
            >
              Sign Out
            </Typography>
          </AccountBox>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            color: "grey",
          }}
        >
          <Typography sx={{ fontSize: "12px" }}>Privacy Policy . </Typography>
          <Typography sx={{ fontSize: "12px" }}> Terms of Service </Typography>
        </Box>
      </Menu>

      <Dialog
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "500px",
              height: "500px",
              borderRadius: "30px",
            },
          },
        }}
        hideBackdrop
        aria-labelledby="customized-dialog-title"
        open={openDialog}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              sx={{
                marginTop: "20px",
                fontSize: "20px",
                fontWeight: "bold",
                color: "darkblue",
              }}
            >
              Profile Picture
            </Typography>
            <IconButton
              sx={{ position: "absolute", right: "8px", top: "8px" }}
              onClick={() => setOpenDialog(false)}
            >
              <Close />
            </IconButton>
          </Box>

          <Avatar
            sx={{
              marginTop: "50px",
              width: "200px",
              height: "200px",
            }}
            src={imageUrl}
          >
            {!profileImage && user?.userName?.charAt(0)}
          </Avatar>

          <Box sx={{ display: "flex", gap: "30px", marginTop: "50px" }}>
            <Button
              sx={{
                color: "#333",
                border: "1px solid grey",
                borderRadius: "30px",
                padding: "10px 20px",
                textTransform: "none",
              }}
              onClick={() =>
                document.getElementById("profile-image-upload").click()
              }
            >
              <AddAPhoto sx={{ color: "blue", marginRight: "8px" }} />
              <input
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                id="profile-image-upload"
                onChange={handleProfileUpload}
              />
              Add New Picture
            </Button>

            <Button
              sx={{
                color: "#333",
                border: "1px solid grey",
                borderRadius: "30px",
                padding: "10px 40px",
                textTransform: "none",
              }}
              onClick={handleDeleteProfileImage}
            >
              <Delete sx={{ color: "blue", marginRight: "8px" }} />
              Remove
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default ProfileIcon;
