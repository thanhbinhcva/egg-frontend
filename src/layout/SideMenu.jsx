// src/layout/SideMenu.jsx
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import EggIcon from '@mui/icons-material/Egg';
import PeopleIcon from '@mui/icons-material/People';
import { NavLink } from 'react-router-dom';

export default function SideMenu() {
  const items = [
    { to: '/buyers', label: 'Khách hàng', icon: <PeopleIcon /> },
    { to: '/products', label: 'Sản phẩm trứng', icon: <EggIcon /> },
  ];

  return (
    <List>
      {items.map(({ to, label, icon }) => (
        <ListItemButton
          key={to}
          component={NavLink}
          to={to}
          sx={{ '&.active': { bgcolor: 'action.selected' } }}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={label} />
        </ListItemButton>
      ))}
    </List>
  );
}
