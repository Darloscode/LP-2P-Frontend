import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthenticatedUserRole } from "@store";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";

type ListItem = {
  text: string;
  route: string;
  icon: ReactNode;
};

const adminListItems = [
  { text: "Vista General", route: "/", icon: <HomeRoundedIcon /> },
  { text: "Usuarios", route: "/usuarios", icon: <GroupRoundedIcon /> },
  { text: "Servicios ", route: "/servicios", icon: <AssignmentRoundedIcon /> },
  { text: "Citas ", route: "/citas", icon: <CalendarMonthRoundedIcon /> },
  { text: "Nueva cita ", route: "/nueva-cita", icon: <EditCalendarIcon /> },
];

export default function MenuContent() {
  const navigate = useNavigate();
  const userRole = getAuthenticatedUserRole();
  let mainListItems: ListItem[];

  if (userRole === "Admin") {
    mainListItems = adminListItems;
  } else {
    mainListItems = [];
  }

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => navigate(item.route)}
              selected={
                item.route === "/"
                  ? window.location.pathname === item.route
                  : window.location.pathname.startsWith(item.route)
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/*  <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => navigate(item.route)}
              selected={
                item.route === "/"
                  ? window.location.pathname === item.route
                  : window.location.pathname.startsWith(item.route)
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Stack>
  );
}
