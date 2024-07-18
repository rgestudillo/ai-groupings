import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Generate your Fair Groupings in seconds."
          />
          <meta property="og:site_name" content="ai-groupings.vercel.app" />
          <meta
            property="og:description"
            content="Generate your Fair Groupings in seconds."
          />
          <meta property="og:title" content="Random Groupings Generator" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Random Groupings Generator" />
          <meta
            name="twitter:description"
            content="Generate your Fair Groupings in seconds."
          />
          <meta
            property="og:image"
            content="https://ai-groupings.vercel.app/preview.jpg"
          />
          <meta
            name="twitter:image"
            content="https://ai-groupings.vercel.app/preview.jpg"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
