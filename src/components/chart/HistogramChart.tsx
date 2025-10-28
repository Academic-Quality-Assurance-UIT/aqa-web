import React, { useMemo } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ReferenceLine,
	Cell,
} from "recharts";
import _ from "lodash";

interface DataItem {
	point: number;
}

interface ProcessedDataPoint {
	point: number;
	count: number;
	percentage: string;
}

interface ProcessedData {
	chartData: ProcessedDataPoint[];
	percentile20: number;
	percentile80: number;
	percentage20: number;
	percentage80: number;
	p20Index: number;
	p80Index: number;
	total: number;
}

interface HistogramChartProps {
	rawData?: DataItem[];
}

interface TooltipProps {
	active?: boolean;
	payload?: Array<{
		payload: ProcessedDataPoint;
	}>;
}

const HistogramChart: React.FC<HistogramChartProps> = ({ rawData = [] }) => {
	const processedData: ProcessedData = useMemo(() => {
		const roundedPoints = rawData.map(
			(item) => Math.round(item.point * 20) / 20
		);

		const bins: Record<string, number> = {};
		for (let i = 0; i <= 80; i++) {
			bins[(i / 20).toFixed(2)] = 0;
		}

		roundedPoints.forEach((point) => {
			const key = point.toFixed(2);
			if (bins[key] !== undefined) {
				bins[key]++;
			}
		});

		const total = rawData.length;

		let chartData: { point: number; count: number; percentage: string }[] =
			Object.entries(bins).map(([point, count]) => ({
				point: parseFloat(point),
				count: count,
				percentage: ((count / total) * 100).toFixed(2),
			}));
		chartData = chartData.filter(
			(point) =>
				point.point >=
				Math.min(
					...chartData
						.filter((d: any) => d.count > 0)
						.map((d: any) => d.point)
				)
		);
		chartData = chartData.filter(
			(point) =>
				point.point <=
				Math.max(
					...chartData
						.filter((d: any) => d.count > 0)
						.map((d: any) => d.point)
				)
		);

		const sortedPoints = [...roundedPoints].sort((a, b) => a - b);
		const p20Index = Math.floor(sortedPoints.length * 0.2);
		const p80Index = Math.floor(sortedPoints.length * 0.8);
		const percentile20 = sortedPoints[p20Index];
		const percentile80 = sortedPoints[p80Index];
		const percentage20 =
			(sortedPoints.filter((point) => point <= percentile20).length / total) *
			100;
		const percentage80 =
			100 -
			(sortedPoints.filter((point) => point >= percentile80).length / total) *
				100;

		return {
			chartData,
			percentile20,
			percentile80,
			p20Index,
			p80Index,
			percentage20,
			percentage80,
			total,
		};
	}, [rawData]);

	const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 border border-gray-300 rounded shadow-lg text-sm">
					<p className="">
						Điểm từ{" "}
						<span className=" font-semibold">
							{payload[0].payload.point.toFixed(2)}
						</span>{" "}
						đến{" "}
						<span className=" font-semibold">
							{(payload[0].payload.point + 0.05).toFixed(2)}
						</span>
					</p>
					<p className="text-[#0ea5e9]">
						Số lượng:{" "}
						<span className=" font-semibold">
							{payload[0].payload.count}
						</span>
					</p>
					<p className="text-[#10b981]">
						Tỷ lệ:{" "}
						<span className=" font-semibold">
							{payload[0].payload.percentage}%
						</span>
					</p>
					<p className="">
						Lớn hơn{" "}
						<span className=" font-semibold">
							{((_.sum(
								processedData.chartData
									.filter(
										(d) => d.point < payload[0].payload.point
									)
									.map((d) => d.count)
							) /
								processedData.total) *
								100).toFixed(2)}
							%
						</span>{" "}
						dữ liệu
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className=" pt-2 bg-transparent rounded-lg">
			<div className="flex justify-center">
				<BarChart
					width={1000}
					height={500}
					data={processedData.chartData}
					margin={{ top: 20, left: 20 }}
				>
					<CartesianGrid strokeDasharray="2 2" />
					<XAxis
						dataKey="point"
						stroke="#d1d5db"
						tick={{ fill: "#9ca3af", fontSize: 14 }}
					/>
					<YAxis
						label={{
							value: "Số lượng",
							angle: -90,
							position: "insideLeft",
						}}
						stroke="#d1d5db"
						tick={{ fill: "#9ca3af", fontSize: 14 }}
					/>
					<Tooltip content={<CustomTooltip />} />

					<ReferenceLine
						x={processedData.percentile20}
						stroke="#fbbf24"
						strokeWidth={2}
						label={{
							value: `Dưới ${processedData.percentage20.toFixed(
								2
							)}% (Điểm <= ${processedData.percentile20.toFixed(2)})`,
							position: "top",
							fill: "#ef568b",
							fontSize: 14,
							fontWeight: "600",
						}}
					/>

					<ReferenceLine
						x={processedData.percentile80}
						stroke="#10b981"
						strokeWidth={2}
						label={{
							value: `Trên ${processedData.percentage80.toFixed(
								2
							)}% (Điểm >= ${processedData.percentile80.toFixed(2)})`,
							position: "top",
							fill: "#10b981",
							fontSize: 14,
							fontWeight: "600",
						}}
					/>

					<Bar dataKey="count" fill="#3b82f6" name="Số lượng">
						{processedData.chartData.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={
									entry.point <= processedData.percentile20
										? "#ef568b"
										: entry.point >= processedData.percentile80
										? "#10b981"
										: "#0ea5e9"
								}
							/>
						))}
					</Bar>
				</BarChart>
			</div>
		</div>
	);
};

export default HistogramChart;
