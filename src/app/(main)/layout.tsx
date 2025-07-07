"use client";

import LecturerNavIcon from "@/assets/LecturerNavIcon";
import NavigationDrawer, { NavItem } from "@/components/NavigationDrawer";
import { useProfileQuery } from "@/gql/graphql";
import { useIsAdmin, useIsFullAccess, useIsLecturer } from "@/hooks/useIsAdmin";
import { useIsFaculty } from "@/hooks/useIsFaculty";
import CommentIcon from "@assets/CommentIcon";
import CriteriaIcon from "@assets/CriteriaIcon";
import AIGenerateIcon from "@assets/AIGenerateIcon";
import HomeIcon from "@assets/HomeIcon";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import StaffSurveyIcon from "@/assets/StaffSurveyIcon";

export default function Layout({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const { data, loading } = useProfileQuery({ fetchPolicy: "network-only" });
	const { isFullAcess } = useIsFullAccess();
	const { isAdmin } = useIsAdmin();
	const { isFaculty } = useIsFaculty();
	const { isLecturer } = useIsLecturer();

	useEffect(() => {
		if (loading === false && !data) {
			router.replace("/signin");
		}
	}, [data, loading, router]);

	return (
		<>
			<NavigationDrawer>
				<NavItem title="Trang chủ" description="Tổng quan về dữ liệu" link="/" icon={HomeIcon} />
				<NavItem
					title="Ý kiến"
					description="Ý kiến của sinh viên về giảng viên"
					link="/comment"
					icon={CommentIcon}
					subItems={[
						{
							title: "Tất cả",
							link: "/comment",
						},
						{
							title: "Tích cực",
							link: "/comment?type=positive",
						},
						{
							title: "Tiêu cực",
							link: "/comment?type=negative",
						},
					]}
				/>
				{isFullAcess || isFaculty ? (
					<NavItem
						title="Tra cứu dữ liệu"
						link="/criteria"
						icon={CriteriaIcon}
					/>
				) : isLecturer ? (
					<NavItem
						title="Tra cứu dữ liệu"
						link={`/lecturer/${data?.profile.lecturer?.lecturer_id}`}
						icon={CriteriaIcon}
					/>
				) : null}
				{isFullAcess || isAdmin ? (
					<NavItem
						title="Khảo sát giảng viên"
						link="/staff-survey"
						icon={StaffSurveyIcon}
					/>
				) : null}
				{isFullAcess || isAdmin ? (
					<NavItem
						title="Tạo biểu đồ bằng AI"
						link="/ai-generate"
						icon={AIGenerateIcon}
					/>
				) : null}
				{isAdmin ? (
					<NavItem
						title="Quản lý tài khoản"
						link="/user"
						icon={LecturerNavIcon}
					/>
				) : null}
			</NavigationDrawer>
			<main className="w-full min-h-screen xl:px-20 lg:px-16 px-5 xl:pl-32 lg:pl-24 pt-12 pb-10 overflow-x-hidden">
				<Suspense fallback={<p>Loading</p>}>{children}</Suspense>
			</main>
		</>
	);
}
