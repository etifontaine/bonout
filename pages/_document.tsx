import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body className="font-inter antialiased bg-white text-gray-900 tracking-tight">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument