"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  TrendingUp,
  ShoppingCart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  prefix?: string;
  loading?: boolean;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueData: { month: string; revenue: number }[];
  ordersData: { day: string; orders: number }[];
  categoryData: { name: string; value: number }[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORY_COLORS = ["#f9a8c9", "#c4b5fd", "#86efac", "#fcd34d", "#93c5fd"];

const FALLBACK_STATS: DashboardStats = {
  totalRevenue: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0,
  revenueData: [],
  ordersData: [],
  categoryData: [],
};

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ title, value, change, icon, prefix, loading }: StatCard) {
  const positive = change >= 0;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          {loading ? (
            <span className="inline-block w-20 h-7 bg-muted animate-pulse rounded" />
          ) : (
            <>
              {prefix}
              {value}
            </>
          )}
        </div>
        <p
          className={`text-xs mt-1 flex items-center gap-1 ${positive ? "text-emerald-500" : "text-red-400"}`}
        >
          {positive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {Math.abs(change)}% from last month
        </p>
      </CardContent>
    </Card>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
  prefix = "",
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  prefix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="text-muted-foreground mb-0.5">{label}</p>
      <p className="font-semibold text-foreground">
        {prefix}
        {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

// ── Chart Skeleton ────────────────────────────────────────────────────────────

function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <div
      className="w-full bg-muted animate-pulse rounded-lg"
      style={{ height }}
    />
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(FALLBACK_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAll() {
      try {
        // Fetch all in parallel
        const [ordersRes, productsRes, customersRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products"),
          fetch("/api/customers"),
        ]);

        const [ordersJson, productsJson, customersJson] = await Promise.all([
          ordersRes.json(),
          productsRes.json(),
          customersRes.json(),
        ]);

        // Normalize arrays from various response shapes
        const orders: any[]    = Array.isArray(ordersJson)    ? ordersJson    : (ordersJson.data    ?? ordersJson.orders    ?? []);
        const products: any[]  = Array.isArray(productsJson)  ? productsJson  : (productsJson.data  ?? productsJson.products  ?? []);
        const customers: any[] = Array.isArray(customersJson) ? customersJson : (customersJson.data ?? customersJson.customers ?? []);

        // ── Revenue ──────────────────────────────────────────────────────────
        const activeOrders = orders.filter(
          (o) => !["Cancelled", "Refunded"].includes(o.status)
        );
        const totalRevenue = activeOrders.reduce(
          (sum, o) => sum + Number(o.total ?? 0),
          0
        );

        // ── Revenue by month (last 7 months) ─────────────────────────────────
        const now = new Date();
        const revenueByMonth: Record<string, number> = {};
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = d.toLocaleString("default", { month: "short" });
          revenueByMonth[key] = 0;
        }
        activeOrders.forEach((o) => {
          const d = new Date(o.created_at ?? o.createdAt ?? "");
          if (isNaN(d.getTime())) return;
          const key = d.toLocaleString("default", { month: "short" });
          if (key in revenueByMonth) {
            revenueByMonth[key] += Number(o.total ?? 0);
          }
        });
        const revenueData = Object.entries(revenueByMonth).map(
          ([month, revenue]) => ({ month, revenue: Math.round(revenue) })
        );

        // ── Orders by day of week (current week) ─────────────────────────────
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const ordersByDay: Record<string, number> = Object.fromEntries(
          days.map((d) => [d, 0])
        );
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        orders.forEach((o) => {
          const d = new Date(o.created_at ?? o.createdAt ?? "");
          if (isNaN(d.getTime()) || d < weekAgo) return;
          const key = days[d.getDay()];
          ordersByDay[key] = (ordersByDay[key] ?? 0) + 1;
        });
        // Reorder starting from today's day so the chart flows correctly
        const todayIdx = now.getDay();
        const orderedDays = [
          ...days.slice(todayIdx + 1),
          ...days.slice(0, todayIdx + 1),
        ];
        const ordersData = orderedDays.map((day) => ({
          day,
          orders: ordersByDay[day] ?? 0,
        }));

        // ── Category breakdown ────────────────────────────────────────────────
        const categoryCounts: Record<string, number> = {};
        products.forEach((p) => {
          const cat = p.category ?? p.category_name ?? "Other";
          categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
        });
        const totalProductCount = products.length || 1;
        const categoryData = Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({
            name,
            value: Math.round((count / totalProductCount) * 100),
          }));

        setStats({
          totalRevenue,
          totalOrders:    orders.length,
          totalProducts:  products.length,
          totalCustomers: customers.length,
          revenueData,
          ordersData,
          categoryData: categoryData.length ? categoryData : [{ name: "Products", value: 100 }],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  const statCards: StatCard[] = [
    {
      title: "Total Revenue",
      value: stats.totalRevenue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      change: 0,
      prefix: "$",
      icon: <TrendingUp className="h-4 w-4" />,
      loading,
    },
    {
      title: "Total Orders",
      value: String(stats.totalOrders),
      change: 0,
      icon: <ShoppingCart className="h-4 w-4" />,
      loading,
    },
    {
      title: "Total Products",
      value: String(stats.totalProducts),
      change: 0,
      icon: <Package className="h-4 w-4" />,
      loading,
    },
    {
      title: "Total Customers",
      value: String(stats.totalCustomers),
      change: 0,
      icon: <Users className="h-4 w-4" />,
      loading,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin panel</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Revenue area chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
            <p className="text-xs text-muted-foreground">Monthly revenue — last 7 months</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ChartSkeleton height={240} />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart
                  data={stats.revenueData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f9a8c9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f9a8c9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip prefix="$" />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f9a8c9"
                    strokeWidth={2}
                    fill="url(#revGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category pie chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Products by Category</CardTitle>
            <p className="text-xs text-muted-foreground">Distribution across catalogue</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {loading ? (
              <ChartSkeleton height={180} />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={stats.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {stats.categoryData.map((_, i) => (
                        <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [`${v}%`, ""]}
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="w-full space-y-2">
                  {stats.categoryData.map((c, i) => (
                    <div key={c.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                        />
                        <span className="text-muted-foreground">{c.name}</span>
                      </div>
                      <span className="font-medium">{c.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 — orders bar chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Orders This Week</CardTitle>
          <p className="text-xs text-muted-foreground">Daily order volume — current week</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ChartSkeleton height={200} />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={stats.ordersData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}