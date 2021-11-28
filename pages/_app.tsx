import type { AppProps } from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import NextNprogress from "nextjs-progressbar";
import "../styles/style.scss";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Bonout</title>
        <meta
          name="description"
          content="Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités!"
        />
        <meta charSet="utf-8" />
        <link rel="icon" href="/images/logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:title" content="Bonout" />
        <meta property="og:type" content="siteweb" />
        <meta
          property="og:description"
          content="Organise ton prochain événement sans prise de tête, un seul site avec toutes les fonctionnalités!"
        />
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      ></ToastContainer>
      <NextNprogress color="#000000" />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
