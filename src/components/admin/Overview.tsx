import PageViewsBarChart, {
  PageViewsBarChartProps,
} from "@admin/PageViewsBarChart";
import { getDataAppointment, getDataCard, getIncome } from "@/utils/utils";
import { useEffect, useState } from "react";
import axios from "axios";
import StatCard, { StatCardProps } from "@admin/StatCard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SessionsChart from "@admin/SessionsChart";
import apiURL from "@/API/apiConfig";

export default function MainGrid() {
  const [dataAppointment, setDataAppointment] =
    useState<PageViewsBarChartProps | null>(null);

  const [dataCard, setDataCard] = useState<StatCardProps[]>([]);
  const [income, setIncome] = useState<number[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      try {
        const responseAppointments = await axios.get(`${apiURL}/appointments`, { //Hago get de todas las citas
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responsePayments = await axios.get(`${apiURL}/payments`, { //Hago get de todos los pagos
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseUserAccount = await axios.get(`${apiURL}/users`, { //Hago get de todas las cuentas de usuarios creadas
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formattedData: PageViewsBarChartProps = getDataAppointment(
          responseAppointments.data,
        );
        setDataAppointment(formattedData);

        const incomeData: number[] = getIncome(responsePayments.data);
        setIncome(incomeData);

        const cardData: StatCardProps[] = getDataCard( //Crea lso SatCards de cuentas creadas y citas
          responseUserAccount.data,
          responseAppointments.data,
        );
        setDataCard(cardData);
      } catch (error) {
        console.error("Error loading appointments", error);
      }
    };

    fetchAppointments();
  }, []);

  if (!dataAppointment || dataCard.length === 0 || income.length === 0) {
    return <div>Loading...</div>;
  }

  //SessionsChart es el gráfico lineal de ingresos
  // PageViewsBarChart es el gráfico de barras de citas asistidas
  return (
    <Box
      sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}
      className="xd"
    >
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {dataCard.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart income={income} /> 
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart {...dataAppointment} />
        </Grid>
      </Grid>
    </Box>
  );
}
