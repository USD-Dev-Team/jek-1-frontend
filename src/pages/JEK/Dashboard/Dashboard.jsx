import {
  Box,
  Flex,
  Grid,
  Text,
  Icon,
  Badge,
  Progress,
  Circle,
  Divider,
  useColorModeValue,
  useSafeLayoutEffect,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Zap,
  Award,
  Activity,
  Sun,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useRef, useState } from "react";

function AnimatedCounter({ value, duration = 1200 }) {
  const [count, setCount] = useState(0);
  const start = useRef(null);

  useEffect(() => {
    let raf;
    const step = (timestamp) => {
      if (!start.current) start.current = timestamp;
      const progress = Math.min((timestamp - start.current) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) raf = requestAnimationFrame(step);
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

const months = [
  "Yan",
  "Fev",
  "Mar",
  "Apr",
  "May",
  "Iyn",
  "Iyl",
  "Avg",
  "Sen",
  "Okt",
  "Noy",
  "Dek",
];

const barData = [
  { month: "Yan", current: 18, prev: 12 },
  { month: "Fev", current: 22, prev: 15 },
  { month: "Mar", current: 19, prev: 18 },
  { month: "Apr", current: 31, prev: 22 },
  { month: "May", current: 27, prev: 20 },
  { month: "Iyn", current: 35, prev: 25 },
];




const topCategories = [
  { name: "Suv ta'minoti", count: 124, pct: 88 },
  { name: "Yo'l ta'miri", count: 98, pct: 72 },
  { name: "Gaz", count: 76, pct: 56 },
  { name: "Elektr", count: 54, pct: 40 },
  { name: "Boshqa", count: 22, pct: 16 },
];

const weeklyActivity = [4, 7, 5, 9, 6, 11, 8];
const weekDays = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <Box
      bg="surface"
      border="1px solid"
      borderColor="border"
      borderRadius="lg"
      p={3}
      shadow="lg"
    >
      <Text fontSize="xs" fontWeight="600" mb={2} color="textSecondary">
        {label}
      </Text>
      {payload.map((p, i) => (
        <Flex key={i} align="center" gap={2} mb={1}>
          <Box w={2} h={2} borderRadius="full" bg={p.color} />
          <Text fontSize="xs" color="text">
            {p.name}: <strong>{p.value}</strong>
          </Text>
        </Flex>
      ))}
    </Box>
  );
}
import Cookies from "js-cookie";
import { Requests } from "../../../Services/api/Requests";

export default function Dashboard() {
  const { t } = useTranslation();
  const gridLine = useColorModeValue("#E2E8F0", "#2D3748");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const district = Cookies.get("district");
  const neighborhood = Cookies.get("neighborhood");
  const adminId = Cookies.get("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const year = new Date().getFullYear();
        const res = await Requests.getDashboard(
          year,
          district,
          adminId,
          neighborhood,
        );
        setStats(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const dynamicData =
    stats?.yearlyDynamics?.map((val, i) => ({
      month: months[i],
      current: val,
    })) || [];

  const completed =
    stats?.statuses?.find((s) => s.status === "COMPLETED")?._count?.id || 0;

  const jekCompleted =
    stats?.statuses?.find((s) => s.status === "JEK_COMPLETED")?._count?.id || 0;

  const rejected =
    stats?.statuses?.find((s) => s.status === "REJECTED")?._count?.id || 0;

  const inProgress =
    stats?.totalRequests - (completed + jekCompleted + rejected);


    const dynamicPieData = [
  {
    name: "Bajarilgan",
    value: completed + jekCompleted,
    color: "#48BB78",
  },
  {
    name: "Jarayonda",
    value: inProgress,
    color: "#4299E1",
  },
  {
    name: "Rad etilgan",
    value: rejected,
    color: "#FC8181",
  },
];

const efficiency = stats?.totalRequests
  ? Math.round(((completed + jekCompleted) / stats.totalRequests) * 100)
  : 0;

  return (
    <Box bg="bg" minH="100vh" p={6}>
      {/* ── Header ── */}
      <Flex align="center" gap={3} mb={8} mt={2}>
        <Circle size="40px" bg="primaryBg">
          <Icon as={Sun} color="primary" boxSize={5} />
        </Circle>
        <Box>
          <Text fontSize="xl" fontWeight="700" color="text">
            Dashboard
          </Text>
          <Text fontSize="xs" color="textSecondary">
            Hududiy murojaatlar umumiy holati
          </Text>
        </Box>
      </Flex>

      {/* ── TOP STAT CARDS ── */}
      <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={6}>
        <StatCard
          label="Jami murojaatlar"
          value={stats?.totalRequests || 0}
          icon={FileText}
          iconBg="infoBg"
          iconColor="info"
          accent="info"
        />
        <StatCard
          label="Bajarilgan"
          icon={CheckCircle}
          iconBg="successBg"
          iconColor="success"
          accent="success"
          value={completed + jekCompleted}
        />
        <StatCard
          label="Jarayonda"
          icon={Clock}
          iconBg="warningBg"
          iconColor="warning"
          accent="warning"
          value={inProgress}
        />
        <StatCard
          label="Rad etilgan"
         value={rejected}
          icon={XCircle}
          iconBg="dangerBg"
          iconColor="danger"
          accent="danger"
        />
      </Grid>

      {/* ── ROW 1: Line Chart + Pie Chart ── */}
      <Grid templateColumns="2fr 1fr" gap={4} mb={4}>
        {/* Line Chart */}
        <Box
          bg="surface"
          borderRadius="xl"
          border="1px solid"
          borderColor="border"
          p={5}
        >
          <Flex justify="space-between" align="center" mb={5}>
            <Box>
              <Text fontWeight="700" color="text">
                Yillik o'sish dinamikasi
              </Text>
              <Text fontSize="xs" color="textSecondary">
                Oylar bo'yicha murojaatlar soni
              </Text>
            </Box>
            <Flex gap={4}>
              <Flex align="center" gap={1}>
                <Box w={3} h={1} bg="primary" borderRadius="full" />
                <Text fontSize="xs" color="textSecondary">
                  2026
                </Text>
              </Flex>
              <Flex align="center" gap={1}>
                <Box w={3} h={1} bg="border" borderRadius="full" />
                <Text fontSize="xs" color="textSecondary">
                  2025
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dynamicData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridLine} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey="current"
                name="2025"
                stroke="var(--chakra-colors-border)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 4"
              />
              
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Pie Chart */}
        <Box
          bg="surface"
          borderRadius="xl"
          border="1px solid"
          borderColor="border"
          p={5}
        >
          <Text fontWeight="700" color="text" mb={1}>
            Status taqsimoti
          </Text>
          <Text fontSize="xs" color="textSecondary" mb={4}>
            Barcha murojaatlar nisbati
          </Text>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={dynamicPieData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {dynamicPieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />

                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <Flex direction="column" gap={2} mt={3}>
            {dynamicPieData.map((d, i) => (
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

      {/* ── ROW 2: Bar Chart + Extra Stats ── */}
      <Grid templateColumns="2fr 1fr" gap={4} mb={4}>
        {/* Bar Chart */}
        <Box
          bg="surface"
          borderRadius="xl"
          border="1px solid"
          borderColor="border"
          p={5}
        >
          <Flex justify="space-between" align="center" mb={5}>
            <Box>
              <Text fontWeight="700" color="text">
                Oylik taqqoslash
              </Text>
              <Text fontSize="xs" color="textSecondary">
                Joriy yil vs o'tgan yil
              </Text>
            </Box>
          </Flex>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barGap={4}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridLine}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="current"
                name="2026"
                fill="var(--chakra-colors-primary)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="prev"
                name="2025"
                fill="var(--chakra-colors-border)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Extra: Bugungi kun + O'rtacha vaqt */}
        <Flex direction="column" gap={4}>
          {/* Bugungi kun aktivligi */}
          <Box
            bg="surface"
            borderRadius="xl"
            border="1px solid"
            borderColor="border"
            p={5}
            flex={1}
          >
            <Flex align="center" gap={2} mb={3}>
              <Icon as={Sun} color="warning" boxSize={4} />
              <Text fontWeight="700" color="text" fontSize="sm">
                Bugungi faollik
              </Text>
            </Flex>
            <Grid templateColumns="1fr 1fr" gap={3}>
              <Box bg="infoBg" borderRadius="lg" p={3} textAlign="center">
                <Text fontSize="xl" fontWeight="700" color="info">
                  <AnimatedCounter value={stats?.todayActivity?.received || 0} />
                </Text>
                <Text fontSize="xs" color="textSecondary">
                  Qabul qilindi
                </Text>
              </Box>
              <Box bg="successBg" borderRadius="lg" p={3} textAlign="center">
                <Text fontSize="xl" fontWeight="700" color="success">
                  <AnimatedCounter value={stats?.todayActivity.finished || 0} />
                </Text>
                <Text fontSize="xs" color="textSecondary">
                  Tugatildi
                </Text>
              </Box>
            </Grid>
          </Box>

          {/* O'rtacha bajarish vaqti */}
         
        </Flex>
      </Grid>

      <Grid templateColumns="1fr 1fr 1fr" gap={4}>
      

        {/* Haftalik faollik sparkline */}
       

        <Box
          bg="surface"
          borderRadius="xl"
          border="1px solid"
          borderColor="border"
          p={5}
        >
          <Flex align="center" gap={2} mb={4}>
            <Icon as={TrendingUp} color="success" boxSize={4} />
            <Text fontWeight="700" color="text" fontSize="sm">
              Samaradorlik indikatori
            </Text>
          </Flex>
          <Text fontSize="xs" color="textSecondary" mb={5}>
            Oxirgi 30 kundagi bajarilgan/rad nisbati
          </Text>

          <Flex justify="center" mb={4}>
            <Box position="relative" w="100px" h="100px">
              <svg viewBox="0 0 100 100" width="100" height="100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="var(--chakra-colors-border)"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="var(--chakra-colors-success)"
                  strokeWidth="10"
            strokeDasharray={`${(efficiency / 100) * 251} 251`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dasharray 1s ease" }}
                />
              </svg>
              <Flex
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                align="center"
                justify="center"
                direction="column"
              >
                <Text
                  fontSize="xl"
                  fontWeight="800"
                  color="success"
                  lineHeight={1}
                >
              {efficiency}%
                </Text>
                <Text fontSize="8px" color="textSecondary">
                  samarali
                </Text>
              </Flex>
            </Box>
          </Flex>

          <Divider borderColor="border" mb={3} />
          <Flex justify="space-between">
            <Box textAlign="center">
              <Text fontSize="lg" fontWeight="700" color="success">
                <AnimatedCounter value={completed + jekCompleted} />
              </Text>
              <Text fontSize="xs" color="textSecondary">
                Bajarilgan
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="lg" fontWeight="700" color="danger">
                <AnimatedCounter value={+ rejected} />
              </Text>
              <Text fontSize="xs" color="textSecondary">
                Rad etilgan
              </Text>
            </Box>
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
}
