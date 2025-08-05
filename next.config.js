/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/:path*", // frontend endpoint
				destination: "http://localhost:8000/graphql", // backend server
			},
		];
	},
};

module.exports = nextConfig;
