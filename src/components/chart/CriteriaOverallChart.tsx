"use client";

import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import PointEachSemester from "../PointEachSemester";
import FacultySelector from "../selectors/FacultySelector";
import ProgramSelector from "../selectors/ProgramSelector";
import SubjectSelector from "../selectors/SubjectSelector";
import { Role } from "@/gql/graphql";
import { FilterProvider } from "@/contexts/FilterContext";

export default function CriteriaOverallChart() {
	const { query, role } = useFilterUrlQuery();

	const currentRoleName =
		role === Role.Admin || role == Role.FullAccess
			? "toàn trường"
			: role == Role.Faculty
			? "khoa/bộ môn"
			: "giảng viên";

	return (
		<PointEachSemester
			query={query}
			title={`Điểm đánh giá trung bình của ${currentRoleName} qua từng học kỳ`}
			legend="Điểm đánh giá"
			selectors={
				<>
					<ProgramSelector />
					{role == Role.Admin || role == Role.FullAccess ? null : (
						<FacultySelector />
					)}
					<SubjectSelector />
				</>
			}
		/>
	);
}

export function CurrentLecturerOverallChart() {
	const { currentLecturerId } = useFilterUrlQuery();

	return (
		<PointEachSemester
			overrideQueries={{
				lecturer_id: currentLecturerId,
			}}
			title="Điểm đánh giá trung bình của giảng viên qua từng học kỳ"
			legend="Điểm đánh giá"
			selectors={
				<>
					<ProgramSelector />
					<SubjectSelector />
				</>
			}
		/>
	);
}

const dataFormatter = (number: number) => {
	return `${number.toFixed(2)}`;
};

interface IChartData {
	display_name: string;
	criteria_id: string;
	point: number;
	index: number;
	num: number;
}

const LEGEND = "Độ hài lòng";
