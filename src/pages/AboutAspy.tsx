import { useEffect, useState } from "react";

export default function AboutAspy() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);
  console.log(usuarios);

  return <h1>Hola soy sobre</h1>;
}
