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
import { useEffect, useRef, useState } from "react";
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
import { useTranslation } from "react-i18next";

const months = [
  "Yan", "Fev", "Mar", "Apr", "May", "Iyn",
  "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"
];

export default function InspectionDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
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
      name: t("idashboard.idashboard.bajarilgan"),
      value: completed + jekCompleted,
      color: "#22C55E",
    },
    {
      name: t("idashboard.idashboard.jarayonda"),
      value: pending + inProgress,
      color: "#3B82F6",
    },
    {
      name: t("idashboard.idashboard.rad_etilgan"),
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

  function AnimatedCounter({ value, duration = 1200 }) {
    const [count, setCount] = useState(0);
    const start = useRef(null);

    useEffect(() => {
      let raf;
      start.current = null;

      const step = (timestamp) => {
        if (!start.current) start.current = timestamp;

        const progress = Math.min((timestamp - start.current) / duration, 1);
        setCount(Math.floor(progress * value));

        if (progress < 1) {
          raf = requestAnimationFrame(step);
        }
      };

      raf = requestAnimationFrame(step);

      return () => cancelAnimationFrame(raf);
    }, [value, duration]);

    return <>{count}</>;
  }

  function StatCard({ label, value, icon, iconBg, iconColor, accent }) {
    return (
      <Box
        bg="surface"
        borderRadius="xl"
        border="1px solid"
        borderColor="border"
        borderTop="3px solid"
        borderTopColor={accent}
        p={5}
        _hover={{ transform: "translateY(-2px)", shadow: "md" }}
        transition="all 0.2s"
      >
        <Flex justify="space-between" align="flex-start">
          <Box>
            <Text fontSize="sm" color="textSecondary" mb={1}>
              {label}
            </Text>
            <Text fontSize="2xl" fontWeight="700" color="text">
              <AnimatedCounter value={value} />
            </Text>
          </Box>
          <Circle size="44px" bg={iconBg}>
            <Icon as={icon} boxSize={5} color={iconColor} />
          </Circle>
        </Flex>
      </Box>
    );
  }

  return (
    <Box p={6} bg="bg" minH="100vh">

      {/* 🔥 HEADER */}
      <Flex align="center" gap={3} mb={6}>
        <Circle size="40px" bg="primaryBg">
          <Icon as={CheckCircle} color="primary" />
        </Circle>
        <Box>
          <Text fontSize="xl" fontWeight="700">
            {t("idashboard.idashboard.dashboard")}
          </Text>
          <Text fontSize="xs" color="textSecondary">
            {t("idashboard.idashboard.hudundingiumumiyholati")}
          </Text>
        </Box>
      </Flex>

      {/* 🎯 FILTER */}
      <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={6}>
        <Box>
          <Text fontSize="sm">{t("idashboard.idashboard.yil")}</Text>
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
          <Text fontSize="sm">{t("idashboard.idashboard.tuman")}</Text>
          <Select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setNeighborhood("");
            }}
            bg="surface"
            borderColor="border"
          >
            <option value="">{t("idashboard.idashboard.barchasi")}</option>
            {tumanlar.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </Box>

        <Box>
          <Text fontSize="sm">{t("idashboard.idashboard.mahalla")}</Text>
          <Select
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            isDisabled={!district}
            bg="surface"
            borderColor="border"
          >
            <option value="">{t("idashboard.idashboard.barchasi")}</option>
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
            <StatCard
              label={t("idashboard.idashboard.bajarilgan")}
              value={(completed || 0) + (jekCompleted || 0)}
              icon={CheckCircle}
              iconBg="green.100"
              iconColor="green.500"
              accent="green.500"
            />

            <StatCard
              label={t("idashboard.idashboard.jarayonda")}
              value={(pending || 0) + (inProgress || 0)}
              icon={Clock}
              iconBg="yellow.100"
              iconColor="yellow.500"
              accent="yellow.500"
            />

            <StatCard
              label={t("idashboard.idashboard.rad_etilgan")}
              value={rejected || 0}
              icon={XCircle}
              iconBg="red.100"
              iconColor="red.500"
              accent="red.500"
            />
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
              <Text mb={3}>{t("idashboard.idashboard.yillik_murojaatlar")}</Text>

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
              <Text mb={3}>{t("idashboard.idashboard.holat_taqsimoti")}</Text>

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
              <Flex direction="column" gap={2} mt={3}>
                {pieData.map((d, i) => (
                  <Flex key={i} align="center" justify="space-between">
                    <Flex align="center" gap={2}>
                      <Box w={2} h={2} borderRadius="full" bg={d.color} />
                      <Text fontSize="xs" color="textSecondary">
                        {d.name}
                      </Text>
                    </Flex>
                    <Text fontSize="xs" fontWeight="600" color="text">
                      {d.value}
                    </Text>
                  </Flex>
                ))}
              </Flex>
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