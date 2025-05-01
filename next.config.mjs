// next.config.mjs
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'givethfoqhmilfwqbeqp.supabase.co',
          pathname: '/storage/v1/object/public/**',
        },
      ],
    },
  }
  
  export default nextConfig
  
