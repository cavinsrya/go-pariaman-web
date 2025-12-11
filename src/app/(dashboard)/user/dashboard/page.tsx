import { getProductViewAnalytics, getUserProductsForDropdown } from "./action";
import AnalyticsDashboard from "./_components/analytics-dashboard";

export const metadata = {
  title: "UMKM | Dashboard",
};

export default async function DashboardPage() {
  const [userProducts, initialChartData] = await Promise.all([
    getUserProductsForDropdown(),
    getProductViewAnalytics({
      productId: "all",
      timeRange: "7d",
    }),
  ]);

  return (
    <div className="w-full p-6">
      <AnalyticsDashboard
        initialChartData={initialChartData}
        products={userProducts}
      />
    </div>
  );
}
