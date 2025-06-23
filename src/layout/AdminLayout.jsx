// src/layout/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box, Drawer, Toolbar, AppBar, Typography,
  IconButton, Badge, Avatar, Menu, MenuItem
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SideMenu from './SideMenu';

/* ⭐ import logo từ thư mục public (hoặc src/assets) */
import logo from '/logo.png';   // Vite sẽ phát sinh URL theo BASE_URL

const drawerWidth = 240;

export default function AdminLayout() {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* ---------- TOP BAR ---------- */}
      <AppBar position="fixed" color="primary" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/*  LOGO + TÊN  */}
          <Box display="flex" alignItems="center">
            {/* Avatar hiển thị logo vuông, cao 40 px */}
            <Avatar
              src={logo}
              variant="square"
              alt="logo"
              sx={{
                width: 48,       // ✅ đặt kích thước cụ thể
                height: 48,
                mr: 1,
                bgcolor: 'white',  // ✅ nền trắng để logo nổi bật
                objectFit: 'contain', // không bị crop
                p: 0.5,           // padding nhẹ cho đẹp
            }}
            />
            <Typography variant="h6" fontWeight={700} sx={{ userSelect: 'none' }}>
              EGG&nbsp;SHOP
            </Typography>
          </Box>

          {/*  ICONS BÊN PHẢI  */}
          <Box>
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Badge badgeContent={5} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar src="/avatar.png" alt="User" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={openMenu} onClose={() => setAnchorEl(null)}>
              <MenuItem>Thông tin tài khoản</MenuItem>
              <MenuItem onClick={() => {/* TODO: logout */}}>Đăng xuất</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ---------- SIDE BAR ---------- */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />  {/* chừa chỗ cho AppBar */}
        <SideMenu />
      </Drawer>

      {/* ---------- MAIN CONTENT ---------- */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
