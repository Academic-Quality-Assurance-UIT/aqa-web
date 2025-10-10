/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/:path*", // frontend endpoint
				destination: process.env.BACKEND_URL, // backend server
			},
		];
	},
};

module.exports = nextConfig;
