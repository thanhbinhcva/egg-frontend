import { Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import React, { useState } from "react";

const MenuUser = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Avatar alt="User Avatar" src="/avatar.png" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Thông tin tài khoản</MenuItem>
        <MenuItem onClick={() => {
          handleClose();
          // Xử lý logout ở đây
        }}>
          Đăng xuất
        </MenuItem>
      </Menu>
    </>
  );
};

export default MenuUser;
