import Chart from "chart.js/auto";
import React, { useEffect, useState } from "react";

const SensorDataChart = () => {
  const [sensorData, setSensorData] = useState({});
  const [chartInstances, setChartInstances] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [roomStates, setRoomStates] = useState({});

  const roomIds = [1, 2, 3, 4];

  const getToken = () => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  };

  const sendSensorData = async (sensorId, roomState) => {
    // Define a temperatura conforme a ocupação e estado do AC
    const temperatura =
      roomState.occupancy && roomState.ac
        ? Math.random() * (22 - 18) + 18 // Temperatura entre 18°C e 22°C
        : Math.random() * 50; // Temperatura aleatória padrão

    const dadosSensor = {
      sensor_id: sensorId,
      temperatura,
      ocupacao: roomState.occupancy,
      iluminacao: roomState.isLightOn ? "ligada" : "desligada",
      ac: roomState.ac ? "ligado" : "desligado",
      acTemperature: roomState.acTemperature,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:3000/dados-sensores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosSensor),
      });
      if (response.ok) {
        console.log(`Dados enviados com sucesso para sensor_id ${sensorId}`);
      } else {
        console.error(`Erro ao enviar dados para sensor_id ${sensorId}`);
      }
    } catch (error) {
      console.error("Erro ao enviar dados do sensor:", error);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const response = await fetch("http://localhost:3000/dados-sensores", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();

          if (Array.isArray(data)) {
            const dataByRoom = roomIds.reduce((acc, id) => {
              acc[id] = data.filter((entry) => entry.sensor_id === id);
              return acc;
            }, {});
            setSensorData(dataByRoom);
          } else {
            console.error("Dados recebidos não são um array:", data);
            setSensorData({});
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      };

      fetchData();
    }
  }, [token]);

  useEffect(() => {
    const updateChartData = async () => {
      if (!isPaused) {
        for (const roomId of roomIds) {
          const roomState = roomStates[roomId] || {
            isLightOn: false,
            occupancy: false,
            ac: false,
            acTemperature: 22,
          };

          await sendSensorData(roomId, roomState);
        }
      }
    };

    if (token) {
      const interval = setInterval(updateChartData, 10000);
      return () => clearInterval(interval);
    }
  }, [token, isPaused, roomStates]);

  useEffect(() => {
    if (!isLoading) {
      Object.values(chartInstances).forEach((instances) => {
        instances.forEach((instance) => {
          if (instance) {
            instance.destroy();
          }
        });
      });

      const newChartInstances = {};

      roomIds.forEach((roomId) => {
        const tempCtx = document.getElementById(`temp-chart-${roomId}`);
        const occupancyCtx = document.getElementById(`occupancy-chart-${roomId}`);
        const lightCtx = document.getElementById(`light-chart-${roomId}`);

        const roomData = sensorData[roomId] || [];

        newChartInstances[roomId] = [];

        const chartOptions = {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.5,
        };

        if (tempCtx) {
          const tempChart = new Chart(tempCtx, {
            type: "line",
            data: {
              labels: roomData.map((entry) =>
                new Date(entry.timestamp).toLocaleString("pt-BR")
              ),
              datasets: [
                {
                  label: "Temperatura (°C)",
                  data: roomData.map((entry) => entry.temperatura),
                  borderColor: "rgba(255, 99, 132, 1)",
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderWidth: 2,
                },
              ],
            },
            options: chartOptions,
          });
          newChartInstances[roomId].push(tempChart);
        }

        if (occupancyCtx) {
          const occupancyChart = new Chart(occupancyCtx, {
            type: "line",
            data: {
              labels: roomData.map((entry) =>
                new Date(entry.timestamp).toLocaleString("pt-BR")
              ),
              datasets: [
                {
                  label: "Ocupação",
                  data: roomData.map((entry) => (entry.ocupacao ? 1 : 0)),
                  borderColor: "rgba(54, 162, 235, 1)",
                  backgroundColor: "rgba(54, 162, 235, 0.2)",
                  borderWidth: 2,
                  stepped: true,
                },
              ],
            },
            options: chartOptions,
          });
          newChartInstances[roomId].push(occupancyChart);
        }

        if (lightCtx) {
          const lightChart = new Chart(lightCtx, {
            type: "line",
            data: {
              labels: roomData.map((entry) =>
                new Date(entry.timestamp).toLocaleString("pt-BR")
              ),
              datasets: [
                {
                  label: "Luz Ligada",
                  data: roomData.map((entry) =>
                    entry.iluminacao === "ligada" ? 1 : 0
                  ),
                  borderColor: "rgba(255, 206, 86, 1)",
                  backgroundColor: "rgba(255, 206, 86, 0.2)",
                  borderWidth: 2,
                  stepped: true,
                },
              ],
            },
            options: chartOptions,
          });
          newChartInstances[roomId].push(lightChart);
        }
      });

      setChartInstances(newChartInstances);
    }
  }, [sensorData, isLoading]);

  const toggleLight = (roomId) => {
    setRoomStates((prevStates) => ({
      ...prevStates,
      [roomId]: {
        ...prevStates[roomId],
        isLightOn: !prevStates[roomId]?.isLightOn,
      },
    }));
  };

  const toggleOccupancy = (roomId) => {
    setRoomStates((prevStates) => ({
      ...prevStates,
      [roomId]: {
        ...prevStates[roomId],
        occupancy: !prevStates[roomId]?.occupancy,
        isLightOn: false,
        ac: false,
      },
    }));
  };

  const toggleAc = (roomId) => {
    setRoomStates((prevStates) => ({
      ...prevStates,
      [roomId]: {
        ...prevStates[roomId],
        ac: !prevStates[roomId]?.ac,
        acTemperature: prevStates[roomId]?.ac
          ? Math.random() * (22 - 18) + 18
          : prevStates[roomId]?.acTemperature,
      },
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", overflowY: "auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${roomIds.length}, 1fr)`,
          gap: "20px",
          width: "100%",
          padding: "10px",
        }}
      >
        {roomIds.map((roomId) => (
          <div
            key={roomId}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "#f7f7f7",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <h3 style={{ textAlign: "center", fontSize: "14px", margin: "4px 0" }}>Quarto {roomId}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
              <canvas id={`temp-chart-${roomId}`} style={{ maxHeight: "200px" }}></canvas>
              <canvas id={`occupancy-chart-${roomId}`} style={{ maxHeight: "200px" }}></canvas>
              <canvas id={`light-chart-${roomId}`} style={{ maxHeight: "200px" }}></canvas>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", width: "100%", marginTop: "10px" }}>
              <button onClick={() => toggleLight(roomId)}>
                {roomStates[roomId]?.isLightOn ? "Desligar Luz" : "Ligar Luz"}
              </button>
              <button onClick={() => toggleOccupancy(roomId)}>
                {roomStates[roomId]?.occupancy
                  ? "Marcar como Desocupado"
                  : "Marcar como Ocupado"}
              </button>
              <button onClick={() => toggleAc(roomId)}>
                {roomStates[roomId]?.ac ? "Desligar AC" : "Ligar AC"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SensorDataChart;
