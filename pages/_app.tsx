import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import NextNprogress from "nextjs-progressbar";
import "../styles/style.scss";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { ManagedUIProvider } from "@src/context/UIContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F3F2ED" />
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
      <ManagedUIProvider>
        <Component {...pageProps} />
      </ManagedUIProvider>
      <Analytics />
    </>
  );
}

export default MyApp;
