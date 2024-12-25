import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { usePowerData } from '../hooks/usePowerData';
import { formatCurrency, calculateCost } from '../utils/currency';
import { powerChartOptions } from '../utils/chartConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { currentUsage, history, components } = usePowerData();

  const powerData = {
    labels: history.map(h => new Date(h.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Power Usage (kWh)',
      data: history.map(h => h.totalUsage),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true
    }]
  };

  const dailyAverage = history.length > 0 
    ? history.reduce((acc, curr) => acc + curr.totalUsage, 0) / history.length
    : 0;

  const HOURS_IN_MONTH = 24 * 30;
  const monthlyProjection = calculateCost(dailyAverage * HOURS_IN_MONTH);

  const topConsumers = components
    .filter(comp => comp.isOn)
    .sort((a, b) => b.currentUsage - a.currentUsage)
    .slice(0, 3);

  const totalUsage = components.reduce((acc, curr) => acc + (curr.currentUsage || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Usage</h3>
          <p className="text-3xl font-bold text-blue-600">{currentUsage.toFixed(1)} kWh</p>
          <p className="text-sm text-gray-500">Cost: {formatCurrency(calculateCost(currentUsage))}/hr</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Daily Average</h3>
          <p className="text-3xl font-bold text-green-600">{dailyAverage.toFixed(1)} kWh</p>
          <p className="text-sm text-gray-500">Cost: {formatCurrency(calculateCost(dailyAverage))}/day</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Monthly Projection</h3>
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(monthlyProjection)}</p>
          <p className="text-sm text-gray-500">Based on current usage</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Power Usage Trend</h3>
        <div className="h-[400px]">
          <Line data={powerData} options={powerChartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Consumers</h3>
          <div className="space-y-4">
            {topConsumers.map((component) => (
              <div key={component.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {component.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    {component.currentUsage?.toFixed(1)} kWh
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ 
                      width: `${(component.currentUsage / totalUsage) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            {currentUsage > 6 && (
              <div className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">
                <div className="flex justify-between">
                  <span className="font-medium">High Power Usage</span>
                  <span className="text-sm text-gray-500">Just now</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Current cost: {formatCurrency(calculateCost(currentUsage))}/hr
                </p>
              </div>
            )}
            {components
              .filter(comp => comp.isOn && comp.currentUsage > 2)
              .map(comp => (
                <div 
                  key={comp.id} 
                  className="p-4 rounded-lg bg-red-50 border-l-4 border-red-400"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">High {comp.name} consumption</span>
                    <span className="text-sm text-gray-500">Just now</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Using {comp.currentUsage.toFixed(1)} kWh ({formatCurrency(calculateCost(comp.currentUsage))}/hr)
                  </p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;