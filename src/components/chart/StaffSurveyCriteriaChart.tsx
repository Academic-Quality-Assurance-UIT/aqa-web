import { FilterProvider } from "@/contexts/FilterContext";
import ChartLayout from "./ChartLayout";
import { useGetPointsByCriteriaQuery } from "@/gql/graphql";
import { ComboChart } from "../ComboChart";
import _ from "lodash";
import StaffSurveyCommentPage from "../comments/StaffSurveyCommentPage";

export default function StaffSurveyCriteriaChart({
	category,
}: {
	category: string;
}) {
	const { data: points, loading: isLoading } = useGetPointsByCriteriaQuery({
		variables: {
			category,
		},
		fetchPolicy: "network-only",
	});

	const chartData = (points?.getPointsByCriteria ?? []).map((point) => ({
		"Điểm đánh giá": point.avg_point,
		"Điểm trung bình":
			_.mean(points?.getPointsByCriteria.map((p) => p.avg_point)) || 0,
		name: `${point.index + 1}. ${point.criteria}`,
	}));

	return (
		<div className=" flex flex-col gap-4">
			<FilterProvider>
				<ChartLayout
					primaryTitle="Điểm đánh giá giảng viên theo tiêu chí"
					secondaryTitle={""}
					legends={["Điểm đánh giá"]}
					colors={["sky"]}
					columnNum={points?.getPointsByCriteria.length || 0}
					columnSize={100}
					isFullWidth
					handlerButtons={<></>}
					exportData={chartData}
					exportColumns={[
						{ key: "name", label: "Tiêu chí" },
						{ key: "Điểm đánh giá", label: "Điểm đánh giá" },
						{ key: "Điểm trung bình", label: "Điểm trung bình" },
					]}
					filterDisplay={[{ label: "Danh mục", value: category }]}
				>
					<ComboChart
						data={chartData}
						index="name"
						enableBiaxial={false}
						showLegend={false}
						xAxisLabel="Tiêu chí"
						barSeries={{
							categories: ["Điểm đánh giá"],
							yAxisLabel: "Điểm",
							colors: ["sky"],
							minValue: 1,
							maxValue: 4,
							yAxisWidth: 60,
							valueFormatter: (number: number) => {
								return `${number.toFixed(2)}`;
							},
						}}
						lineSeries={{
							categories: ["Điểm trung bình"],
							showYAxis: true,
							yAxisLabel: "Điểm",
							colors: ["pink"],
							minValue: 1,
							maxValue: 4,
							valueFormatter: (number: number) => {
								return `${number.toFixed(2)}`;
							},
						}}
					/>
					<div className=" mt-12 px-8">
						<h2 className=" font-semibold text-xl">Danh sách ý kiến</h2>
						<div className=" mt-8">
							<StaffSurveyCommentPage category={category} />
						</div>
					</div>
				</ChartLayout>
			</FilterProvider>
		</div>
	);
}
