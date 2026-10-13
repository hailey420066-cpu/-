const nextConfig = {
  async headers() {
    return [{source: '/:path*', headers: [
      {key:'Content-Security-Policy',value:"frame-ancestors https://www.notion.so https://notion.so https://*.notion.site https://*.notion.so"},
      {key:'X-Content-Type-Options', value:'nosniff'},
      {key:'Referrer-Policy', value:'strict-origin-when-cross-origin'}
    ]}];
  }
};
export default nextConfig;
