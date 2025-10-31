"use client";

import { useState, useTransition, useMemo } from "react";
import {
  getProductViewAnalytics,
  type AnalyticsDataPoint as LongAnalyticsDataPoint,
  type TimeRange,
} from "../action";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Loader2, TrendingUp } from "lucide-react";

type Product = {
  id: number;
  title: string;
};

type WideAnalyticsDataPoint = {
  date: string;
  [product_title: string]: number | string;
};

// --- Helper Functions ---
function toVarKey(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
}

function pivotData(data: LongAnalyticsDataPoint[]): WideAnalyticsDataPoint[] {
  const wide: Record<string, WideAnalyticsDataPoint> = {};
  for (const { date, product_title, views } of data) {
    const key = toVarKey(product_title);
    if (!wide[date]) wide[date] = { date };
    wide[date][key] = (Number(wide[date][key]) || 0) + views;
  }
  return Object.values(wide).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

function generateConfig(data: LongAnalyticsDataPoint[]): ChartConfig {
  const names = [...new Set(data.map((d) => d.product_title))];

  const PALETTE = [
    "#2563eb", // blue-600
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#06b6d4", // cyan-500
    "#22c55e", // green-500
    "#e879f9", // fuchsia-400
    "#fb7185", // rose-400
  ];

  const cfg: ChartConfig = {};
  names.forEach((name, i) => {
    const key = toVarKey(name);
    cfg[key] = {
      label: name,
      color: PALETTE[i % PALETTE.length],
    };
  });
  return cfg;
}

// --- End Helper Functions ---

export default function AnalyticsDashboard({
  initialChartData,
  products,
}: {
  initialChartData: LongAnalyticsDataPoint[];
  products: Product[];
}) {
  const [isPending, startTransition] = useTransition();
  const [longChartData, setLongChartData] = useState(initialChartData);

  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [productId, setProductId] = useState<"all" | number>("all");

  // --- Memoized Data ---
  const chartData = useMemo(() => pivotData(longChartData), [longChartData]);
  const chartConfig = useMemo(
    () => generateConfig(longChartData),
    [longChartData]
  );
  const productKeys = useMemo(() => Object.keys(chartConfig), [chartConfig]);
  // --- End Memoized Data ---

  const handleFilterChange = (
    newProductId: "all" | number,
    newTimeRange: TimeRange
  ) => {
    setProductId(newProductId);
    setTimeRange(newTimeRange);

    startTransition(async () => {
      const newLongData = await getProductViewAnalytics({
        productId: newProductId,
        timeRange: newTimeRange,
      });
      setLongChartData(newLongData);
    });
  };

  const totalViews = longChartData.reduce((acc, curr) => acc + curr.views, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analitik Kunjungan Produk</CardTitle>
        <CardDescription>
          {productId === "all"
            ? "Menampilkan kunjungan untuk semua produk"
            : `Menampilkan kunjungan untuk: ${
                products.find((p) => p.id === productId)?.title
              }`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Dropdown Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Select
            value={productId.toString()}
            onValueChange={(value) =>
              handleFilterChange(
                value === "all" ? "all" : Number(value),
                timeRange
              )
            }
          >
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue placeholder="Pilih Produk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Produk</SelectItem>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={timeRange}
            onValueChange={(value) =>
              handleFilterChange(productId, value as TimeRange)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Pilih Rentang Waktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Hari Terakhir</SelectItem>
              <SelectItem value="30d">30 Hari Terakhir</SelectItem>
              <SelectItem value="12m">12 Bulan Terakhir</SelectItem>
              <SelectItem value="all">Semua Waktu (per Tahun)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Chart */}
        <div className="relative">
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart
              data={chartData}
              accessibilityLayer
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  if (timeRange === "7d" || timeRange === "30d")
                    return new Date(value).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    });
                  if (timeRange === "12m")
                    return new Date(value).toLocaleDateString("id-ID", {
                      month: "short",
                      year: "2-digit",
                    });
                  return new Date(value).toLocaleDateString("id-ID", {
                    year: "numeric",
                  });
                }}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <defs>
                {productKeys.map((key) => (
                  <linearGradient
                    key={key}
                    id={`fill-${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="8%"
                      stopColor={`var(--color-${key})`}
                      stopOpacity={0.65}
                    />
                    <stop
                      offset="100%"
                      stopColor={`var(--color-${key})`}
                      stopOpacity={0.08}
                    />
                  </linearGradient>
                ))}
              </defs>

              {productKeys.map((key) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={`var(--color-${key})`}
                  strokeWidth={2.2}
                  fill={`url(#fill-${key})`}
                  fillOpacity={0.6}
                  dot={false}
                  activeDot={{ r: 3 }}
                  // optional: bikin overlap lebih manis
                  // style={{ mixBlendMode: "multiply" }}
                  stackId="a"
                />
              ))}
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Total {totalViews} Kunjungan
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Menampilkan data untuk filter yang dipilih
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
