import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AppointmentCreation from "@admin/AppointmentCreation";
import Header from "@components/Header";

export default function AppointmentView() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Header
            textHeader={"Agendar cita"}
            isCreate={false}
            handle={handleBack}
          />
        </Grid>
        <Grid size={12}>
          <AppointmentCreation />
        </Grid>
      </Grid>
    </Box>
  );
}
