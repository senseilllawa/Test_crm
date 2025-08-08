import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const API_URL = "https://test-crm-3nrl.onrender.com";

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "analytics">("analytics");

  const fetchData = async () => {
    try {
      setLoading(true);
      const ordersRes = await fetch(`${API_URL}/orders`);
      const ordersJson = await ordersRes.json();
      setOrders(ordersJson.orders);

      const summaryRes = await fetch(`${API_URL}/summary`);
      const summaryJson = await summaryRes.json();
      setSummary(summaryJson);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Manage orders and view analytics</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={fetchData}
            className="w-full sm:w-auto bg-white border border-gray-300 hover:bg-gray-100 text-black px-4 py-2 rounded shadow"
          >
            Refresh
          </button>
          <button
            onClick={onLogout}
            className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded shadow hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </div>

      
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("orders")}
          className={`w-full sm:w-auto px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === "orders" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
          }`}
        >
          📦 Orders
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`w-full sm:w-auto px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === "analytics" ? "bg-black text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          📊 Analytics
        </button>
      </div>

      {activeTab === "orders" && (
        <div className="overflow-x-auto rounded shadow border border-gray-200 bg-white max-h-[500px]">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading orders...</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="border px-4 py-2">Order #</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">No Delivery</th>
                  <th className="border px-4 py-2">Total Items</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.map((order: any) => (
                  <tr key={order.number} className="text-center">
                    <td className="border px-4 py-2">{order.number}</td>
                    <td className="border px-4 py-2">{order.status}</td>
                    <td className="border px-4 py-2">{order.items_without_delivery}</td>
                    <td className="border px-4 py-2">{order.total_items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "analytics" && summary && (
        <div>
          {/* Секция с карточками: grid-cols-1 на мобильных, grid-cols-3 на больших */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-600 text-white p-4 rounded shadow">
              <p className="text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold">{summary.total_orders}</p>
              <p className="text-sm mt-1">📦 All orders</p>
            </div>
            <div className="bg-orange-500 text-white p-4 rounded shadow">
              <p className="text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold">{summary.approved_orders}</p>
              <p className="text-sm mt-1">⏱ {summary.approval_rate}% of total</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded shadow">
              <p className="text-sm font-medium">Delivered</p>
              <p className="text-3xl font-bold">{summary.delivered_orders}</p>
              <p className="text-sm mt-1">✅ {summary.delivery_rate}% of total</p>
            </div>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Analytics Chart</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Total", value: summary.total_orders, fill: "#3b82f6" },
                    { name: "Approved", value: summary.approved_orders, fill: "#f97316" },
                    { name: "Delivered", value: summary.delivered_orders, fill: "#22c55e" },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {[
                      "#3b82f6",
                      "#f97316",
                      "#22c55e",
                    ].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Bar>
              </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;