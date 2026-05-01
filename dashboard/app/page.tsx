"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Settings,
  Users,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Search,
  SlidersHorizontal,
  Download,
  ChevronDown,
  Sparkles,
  CreditCard,
  Headphones,
  UserRound,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);

  const [form, setForm] = useState({
    age: 28,
    tenure_months: 5,
    monthly_charges: 95.5,
    total_charges: 480,
    contract_type: 0,
    payment_method: 2,
    internet_service: 1,
    support_tickets: 5,
    usage_hours: 12.5,
    last_payment_days_ago: 30,
    is_autopay: 0,
    discount_used: 0,
    avg_charge_per_month: 80,
    support_intensity: 0.83,
    usage_category: 1,
  });

  const riskData = [
    { name: "High Risk", value: 38 },
    { name: "Medium Risk", value: 27 },
    { name: "Low Risk", value: 35 },
  ];

  const featureData = [
    { month: "Tenure", value: 69 },
    { month: "Charges", value: 76 },
    { month: "Support", value: 88 },
    { month: "Usage", value: 61 },
    { month: "Autopay", value: 52 },
    { month: "Payment", value: 58 },
  ];

  useEffect(() => {
    fetch("http://127.0.0.1:8000/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch(() => setCustomers([]));
  }, []);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: Number(value),
    });
  }

  async function predictCustomer() {
    const updatedForm = {
      ...form,
      avg_charge_per_month: Number(
        (form.total_charges / (form.tenure_months + 1)).toFixed(2)
      ),
      support_intensity: Number(
        (form.support_tickets / (form.tenure_months + 1)).toFixed(2)
      ),
      usage_category:
        form.usage_hours < 20 ? 1 : form.usage_hours < 60 ? 2 : 0,
    };

    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedForm),
    });

    const data = await response.json();
    setResult(data);
  }

  return (
    <main className="min-h-screen bg-[#dfe4ec] p-8 text-[#101828]">
      <section className="mx-auto max-w-7xl rounded-[34px] bg-[#f8fafc] p-6 shadow-2xl">
        <nav className="flex items-center justify-between rounded-[28px] bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white">
              <Sparkles size={24} />
            </div>
            <h1 className="text-2xl font-bold">ChurnOps AI</h1>
          </div>

          <div className="hidden rounded-full bg-[#f3f5f8] p-1 md:flex">
            {["Dashboard", "Analytics", "Customers", "Reports"].map((item, i) => (
              <button
                key={item}
                className={`rounded-full px-5 py-2 text-sm ${
                  i === 0 ? "bg-black text-white" : "text-slate-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-full bg-[#f3f5f8] p-3">
              <Bell size={18} />
            </button>
            <button className="rounded-full bg-[#f3f5f8] p-3">
              <Settings size={18} />
            </button>
            <div className="hidden items-center gap-3 md:flex">
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400" />
              <div>
                <p className="text-sm font-bold">Success Team</p>
                <p className="text-xs text-slate-500">customer@ops.ai</p>
              </div>
            </div>
          </div>
        </nav>

        <div className="mt-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold">Customer Retention Overview</h2>
            <p className="mt-1 text-slate-500">
              AI-powered churn insights, risk segmentation, and retention actions
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-full bg-white px-5 py-3 shadow-sm">
              This Month <ChevronDown size={16} />
            </button>
            <button className="flex items-center gap-2 rounded-full bg-white px-5 py-3 shadow-sm">
              <Download size={16} /> Export
            </button>
            <button className="flex items-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-white shadow-sm">
              <SlidersHorizontal size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-4">
          <MetricCard active title="Total Customers" value="3,000" sub="Active customer base" icon={<Users />} />
          <MetricCard title="Churn Rate" value="31.4%" sub="Predicted this cycle" icon={<TrendingDown />} />
          <MetricCard title="High Risk Users" value="842" sub="Need retention action" icon={<AlertTriangle />} />
          <MetricCard title="Saved Revenue" value="$8,220" sub="Estimated retention value" icon={<ShieldCheck />} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold">Churn Driver Performance</h3>
              <button className="rounded-full bg-[#f3f5f8] px-4 py-2 text-sm">
                This Week
              </button>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={featureData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2f80ed" radius={[18, 18, 18, 18]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-bold">Risk Overview</h3>

            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={riskData} dataKey="value" innerRadius={65} outerRadius={95} paddingAngle={4}>
                  {riskData.map((_, index) => (
                    <Cell key={index} fill={["#2f80ed", "#7db7ff", "#dbeafe"][index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="text-center">
              <h2 className="text-4xl font-bold">70.8%</h2>
              <p className="text-sm text-slate-500">Retention Coverage</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold">Custom Customer Prediction</h3>
          <p className="mt-1 text-slate-500">
            Enter your own customer values and get live churn prediction.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Input label="Age" name="age" value={form.age} onChange={handleChange} />
            <Input label="Tenure Months" name="tenure_months" value={form.tenure_months} onChange={handleChange} />
            <Input label="Monthly Charges" name="monthly_charges" value={form.monthly_charges} onChange={handleChange} />
            <Input label="Total Charges" name="total_charges" value={form.total_charges} onChange={handleChange} />
            <Input label="Support Tickets" name="support_tickets" value={form.support_tickets} onChange={handleChange} />
            <Input label="Usage Hours" name="usage_hours" value={form.usage_hours} onChange={handleChange} />
            <Input label="Last Payment Days Ago" name="last_payment_days_ago" value={form.last_payment_days_ago} onChange={handleChange} />
            <Input label="Autopay 0/1" name="is_autopay" value={form.is_autopay} onChange={handleChange} />
            <Input label="Contract Type 0/1/2" name="contract_type" value={form.contract_type} onChange={handleChange} />
            <Input label="Payment Method 0/1/2/3" name="payment_method" value={form.payment_method} onChange={handleChange} />
            <Input label="Internet Service 0/1/2" name="internet_service" value={form.internet_service} onChange={handleChange} />
            <Input label="Discount Used 0/1" name="discount_used" value={form.discount_used} onChange={handleChange} />
          </div>

          <button
            onClick={predictCustomer}
            className="mt-6 rounded-full bg-blue-500 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-blue-600"
          >
            Predict Custom Customer
          </button>

          {result && (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
              <ResultBox title="Prediction" value={result.prediction} />
              <ResultBox title="Churn Probability" value={`${result.churn_probability}%`} />
              <ResultBox title="Risk Level" value={result.risk_level} />
              <ResultBox title="Action" value={result.recommended_action} />
            </div>
          )}
        </div>

        <div className="mt-6 rounded-[28px] bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <h3 className="text-2xl font-bold">Sample Customer Watchlist</h3>
            <div className="flex items-center gap-2 rounded-full bg-[#f3f5f8] px-4 py-2">
              <Search size={16} />
              <span className="text-sm text-slate-500">Top sample records</span>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="p-3">Customer</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">Tenure</th>
                  <th className="p-3">Charges</th>
                  <th className="p-3">Tickets</th>
                  <th className="p-3">Prediction</th>
                  <th className="p-3">Probability</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.customer_id} className="border-b">
                    <td className="p-3 font-bold">{c.customer_id}</td>
                    <td className="p-3">{c.age}</td>
                    <td className="p-3">{c.tenure_months}</td>
                    <td className="p-3">₹{c.monthly_charges}</td>
                    <td className="p-3">{c.support_tickets}</td>
                    <td className="p-3 font-bold text-blue-600">{c.prediction}</td>
                    <td className="p-3">{c.churn_probability}%</td>
                    <td className="p-3">{c.recommended_action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ title, value, sub, icon, active = false }: any) {
  return (
    <div className={`rounded-[24px] p-6 shadow-sm ${active ? "bg-gradient-to-br from-blue-500 to-blue-400 text-white" : "bg-white"}`}>
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${active ? "bg-white text-blue-500" : "bg-[#f3f5f8] text-blue-500"}`}>
        {icon}
      </div>
      <p className={active ? "text-blue-100" : "text-slate-500"}>{title}</p>
      <h3 className="mt-2 text-4xl font-bold">{value}</h3>
      <p className={active ? "mt-3 text-blue-100" : "mt-3 text-slate-400"}>{sub}</p>
    </div>
  );
}

function Input({ label, name, value, onChange }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-600">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl bg-[#f3f5f8] px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

function ResultBox({ title, value }: any) {
  return (
    <div className="rounded-[22px] bg-[#f3f7ff] p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <h4 className="mt-2 text-xl font-bold text-blue-600">{value}</h4>
    </div>
  );
}