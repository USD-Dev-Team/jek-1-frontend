import {
  Box,
  Flex,
  Grid,
  Text,
  Icon,
  Select,
  Circle,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Requests } from "../../Services/api/Requests";
import manzil from "../../constants/mahallas.json";

const months = [
  "Yan","Fev","Mar","Apr","May","Iyn",
  "Iyl","Avg","Sen","Okt","Noy","Dek"
];

export default function InspectionDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const [year, setYear] = useState(new Date().getFullYear());
  const [district, setDistrict] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  // ✅ STATUS PARSE (REAL DATA)
  const getCount = (statusName) =>
    stats?.statuses?.find(s => s.status === statusName)?._count?.id ?? 0;

  const completed = getCount("COMPLETED");
  const jekCompleted = getCount("JEK_COMPLETED");
  const rejected = getCount("REJECTED");
  const pending = getCount("PENDING");
  const inProgress = getCount("IN_PROGRESS");

  // 📊 LINE DATA
  const lineData =
    stats?.yearlyDynamics?.map((v, i) => ({
      month: months[i],
      value: v,
    })) || [];

  // 🥧 PIE DATA
  const pieData = [
    {
      name: "Bajarilgan",
      value: completed + jekCompleted,
      color: "#22C55E",
    },
    {
      name: "Jarayonda",
      value: pending + inProgress,
      color: "#3B82F6",
    },
    {
      name: "Rad etilgan",
      value: rejected,
      color: "#EF4444",
    },
  ];

  // 📍 ADDRESS DATA
  const tumanlar = manzil?.uz?.addresses || [];
  const mahallalar = manzil?.uz?.mahallas || {};

  // 🚀 FETCH
  useEffect(() => {
    const getDashboard = async () => {
      setLoading(true);
      try {
        const res = await Requests.getDashboardAll(
          year,
          district || undefined,
          neighborhood || undefined
        );
        setStats(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, [year, district, neighborhood]);

  return (
    <Box p={6} bg="bg" minH="100vh">

      {/* 🔥 HEADER */}
      <Flex align="center" gap={3} mb={6}>
        <Circle size="40px" bg="primaryBg">
          <Icon as={CheckCircle} color="primary" />
        </Circle>
        <Box>
          <Text fontSize="xl" fontWeight="700">
            Dashboard
          </Text>
          <Text fontSize="xs" color="textSecondary">
            Hududiy murojaatlar umumiy holati
          </Text>
        </Box>
      </Flex>

      {/* 🎯 FILTER */}
      <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={6}>
        <Box>
          <Text fontSize="sm">Yil</Text>
          <Select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            bg="surface"
            borderColor="border"
          >
            {[2026, 2025, 2024, 2023].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Select>
        </Box>

        <Box>
          <Text fontSize="sm">Tuman</Text>
          <Select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setNeighborhood("");
            }}
            bg="surface"
            borderColor="border"
          >
            <option value="">Barchasi</option>
            {tumanlar.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </Box>

        <Box>
          <Text fontSize="sm">Mahalla</Text>
          <Select
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            isDisabled={!district}
            bg="surface"
            borderColor="border"
          >
            <option value="">Barchasi</option>
            {mahallalar[district]?.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Box>
      </Grid>

      {/* ⏳ LOADING */}
      {loading ? (
        <Flex justify="center" mt={20}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          {/* 📊 STATS */}
          <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={6}>
            <Stat title="Bajarilgan" value={completed + jekCompleted} icon={CheckCircle} color="success" />
            <Stat title="Jarayonda" value={pending + inProgress} icon={Clock} color="warning" />
            <Stat title="Rad etilgan" value={rejected} icon={XCircle} color="danger" />
          </Grid>

          {/* 📈 CHARTS */}
          <Grid templateColumns="2fr 1fr" gap={4}>
            
            {/* LINE */}
            <Box
              bg="surface"
              p={5}
              borderRadius="xl"
              border="1px solid"
              borderColor="border"
            >
              <Text mb={3}>Yillik murojaatlar</Text>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineData}>
                  <CartesianGrid stroke="var(--chakra-colors-border)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line
                    dataKey="value"
                    stroke="var(--chakra-colors-primary)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {/* PIE */}
            <Box
              bg="surface"
              p={5}
              borderRadius="xl"
              border="1px solid"
              borderColor="border"
            >
              <Text mb={3}>Holat taqsimoti</Text>

              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {pieData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>

          </Grid>
        </>
      )}
    </Box>
  );
}


function Stat({ title, value, icon, color }) {
  return (
    <Box
      bg="surface"
      p={5}
      borderRadius="xl"
      border="1px solid"
      borderColor="border"
    >
      <Flex justify="space-between">
        <Box>
          <Text fontSize="sm" color="textSecondary">
            {title}
          </Text>
          <Text fontSize="2xl" fontWeight="700">
            {value}
          </Text>
        </Box>

        <Circle size="42px" bg={`${color}Bg`}>
          <Icon as={icon} color={color} />
        </Circle>
      </Flex>
    </Box>
  );
}