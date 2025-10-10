"use client";
import { useLoginIntegrationMutation } from "@/gql/graphql";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [loginIntegration] = useLoginIntegrationMutation({
		fetchPolicy: "network-only",
	});

	useEffect(() => {
		(async () => {
			let token = searchParams.get("token");
			if (!token) {
				router.replace("/authentication-failed");
				return;
			}

			token = `${token.split(".")[0]}.${token.split(".")[1].replaceAll(" ", "+")}`;
			console.log({ token });

			const redirectUrl = searchParams.get("redirect");
			await loginIntegration({ variables: { token } });
			if (redirectUrl) router.replace(redirectUrl);
		})();
	}, [loginIntegration, router, searchParams]);

	return (
		<div>
			<h1>Đang đăng nhập vào hệ thống...</h1>
		</div>
	);
}
