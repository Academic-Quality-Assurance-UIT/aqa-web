"use client";
import { useLoginIntegrationMutation } from "@/gql/graphql";
import { useAuth } from "@/stores/auth.store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [loginIntegration] = useLoginIntegrationMutation({
		fetchPolicy: "network-only",
	});
	const { authData, isLogin, authLogin } = useAuth();

	useEffect(() => {
		(async () => {
			let token = searchParams.get("token");
			if (!token) {
				router.replace("/authentication-failed");
				return;
			}

			token = `${token.split(".")[0]}.${token
				.split(".")[1]
				.replaceAll(" ", "+")}`;
			console.log({ token });

			const redirectUrl = searchParams.get("redirect");
			const res = await loginIntegration({ variables: { token } });
			if (res.data?.loginIntegration) authLogin(res.data?.loginIntegration);
			if (redirectUrl) router.replace(redirectUrl);
		})();
	}, [authLogin, loginIntegration, router, searchParams]);

	return (
		<div>
			<h1>Đang đăng nhập vào hệ thống...</h1>
		</div>
	);
}
