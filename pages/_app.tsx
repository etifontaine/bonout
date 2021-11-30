import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import NextNprogress from "nextjs-progressbar";
import "../styles/style.scss";
import 'react-loading-skeleton/dist/skeleton.css'
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
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
