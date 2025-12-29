"use client";

import ChartLayout from "@/components/chart/ChartLayout";
import PointWithGroupedEntity from "@/components/chart/PointWithGroupedEntity";
import StaffSurveyCriteriaChart from "@/components/chart/StaffSurveyCriteriaChart";
import { ComboChart } from "@/components/ComboChart";
import StaffSurveySemesterSelector from "@/components/selectors/StaffSurveySemesterSelector";
import { FilterProvider } from "@/contexts/FilterContext";
import {
	useGetPointsByCategoryQuery,
	useGetPointsByCriteriaQuery,
} from "@/gql/graphql";
import { Button, Tab, Tabs } from "@heroui/react";
import _ from "lodash";
import Link from "next/link";
import { useState } from "react";
import { } from "react-icons";

export default function Page() {
	const [semester, setSemester] = useState<string | undefined>(undefined);

	const { data: points, loading: isLoading } = useGetPointsByCategoryQuery({
		variables: { semester },
	});

	const chartData = (points?.getPointsByCategory ?? []).map((point) => ({
		"Điểm đánh giá": point.avg_point,
		"Điểm trung bình":
			_.mean(points?.getPointsByCategory.map((p) => p.avg_point)) || 0,
		name: point.category,
	}));

	return (
		<div>
			<div className=" flex items-center justify-between mb-8">
				<h1 className=" text-2xl font-bold">Dữ liệu khảo sát giảng viên</h1>
				<div className="flex gap-4">
					<StaffSurveySemesterSelector
						semester={semester}
						setSemester={setSemester}
					/>
					<Link href="/staff-survey/add">
						<Button color="primary">
							<p className=" font-semibold">Thêm dữ liệu mới</p>
						</Button>
					</Link>
					<Link href="/staff-survey/upload">
						<Button>
							<p className=" font-semibold">Tải dữ liệu lên</p>
						</Button>
					</Link>
				</div>
			</div>

			<div className=" flex flex-col gap-4">
				<FilterProvider>
					<ChartLayout
						primaryTitle="Điểm đánh giá giảng viên theo danh mục"
						secondaryTitle={""}
						legends={["Điểm đánh giá"]}
						colors={["sky"]}
						columnNum={points?.getPointsByCategory.length || 0}
						columnSize={100}
						isFullWidth
						handlerButtons={<></>}
						exportData={chartData}
						exportColumns={[
							{ key: "name", label: "Danh mục" },
							{ key: "Điểm đánh giá", label: "Điểm đánh giá" },
							{ key: "Điểm trung bình", label: "Điểm trung bình" },
						]}
						filterDisplay={semester ? [{ label: "Học kỳ", value: semester }] : []}
					>
						<ComboChart
							data={chartData}
							index="name"
							enableBiaxial={false}
							showLegend={false}
							barSeries={{
								categories: ["Điểm đánh giá"],
								yAxisLabel: "",
								colors: ["sky"],
								minValue: 3,
								maxValue: 4,
								yAxisWidth: 60,
								valueFormatter: (number: number) => {
									return `${number.toFixed(2)}`;
								},
							}}
							lineSeries={{
								categories: ["Điểm trung bình"],
								showYAxis: true,
								yAxisLabel: "",
								colors: ["pink"],
								minValue: 1,
								maxValue: 4,
								valueFormatter: (number: number) => {
									return `${number.toFixed(2)}`;
								},
							}}
						/>
					</ChartLayout>
				</FilterProvider>
			</div>

			<Tabs
				aria-label="Dynamic tabs"
				items={points?.getPointsByCategory ?? []}
				className=" mt-10"
			>
				{(item) => (
					<Tab key={item.category} title={item.category}>
						<StaffSurveyCriteriaChart category={item.category} semester={semester} />
					</Tab>
				)}
			</Tabs>
		</div>
	);
}

