import Head from "next/head";
import { useRouter, withRouter } from 'next/router'

const SEO = ({ title, description, image}) => {
  const defaultTitle = "Gactivity",
    defaultDescription = "Gactivity",
    siteUrl = "https://doku-builder.gnusa.id",
    defaultImage = `${siteUrl}/icons/android-chrome-192x192.png`,
    twitterUsername = "0121FZZ"
    // twitterUsername,
  const router = useRouter()
  

  const seo = {
    title: `${title}` || defaultTitle,
    description: `${description}` || defaultDescription,
    image: `${image || defaultImage}`,
    url: `${siteUrl}${router.asPath}`
  }

  return (
    <Head>
       <meta charSet="utf-8"/>
       <title>{seo.title}</title>
       <link rel="icon" href="/favicon.ico"/>
       <meta name="description" content={seo.description} />
       <meta name="viewport" content="width=device-width, initial-scale=1"/>
       <meta name="theme-color" content="#000000"/>
       <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"/>
       <link rel="manifest" href="/manifest.json"/>
       <meta name="image" content={seo.image} />
       <meta property="og:title" content={seo.title} />
       <meta property="og:description" content={seo.description} />
       <meta property="og:image" content={seo.image} />
       <meta property="og:url" content={seo.url} />
       <meta property="og:type" content="website" />
       <meta name="twitter:creator" content={`@${twitterUsername}`} />
       <meta name="twitter:title" content={seo.title} />
       <meta name="twitter:description" content={seo.description} />
       <meta name="twitter:image" content={seo.image} />
    </Head>
  )
}

export default withRouter(SEO)