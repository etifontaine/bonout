import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import NextNprogress from "nextjs-progressbar";
import "../styles/style.scss";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import { getUserID, getUserName } from "@src/utils/user";
import manifest from "public/manifest.json";
import { isInstalled, getQueries } from "@src/utils";

function MyApp({ Component, pageProps }: AppProps) {
  if (typeof window !== "undefined") {
    if (!isInstalled() && getUserID()) {
      const urlRoot = location.protocol + "//" + location.host;
      const manifestElement = document.getElementById("manifest");
      const manifestString = JSON.stringify({
        ...manifest,
        icons: manifest.icons.map((icon) => ({
          ...icon,
          src: urlRoot + icon.src,
        })),
        scope: urlRoot,
        start_url:
          `${
            location.protocol + "//" + location.host
          }/home?userID=${getUserID()}` +
          (getUserName() ? `&userName=${getUserName()}` : ""),
      });
      manifestElement?.setAttribute(
        "href",
        "data:application/json;charset=utf-8," +
          encodeURIComponent(manifestString)
      );
    }
    const queries = getQueries();
    if (queries && queries.userID) {
      window.localStorage.setItem("user_id", queries.userID);
      if (queries.userName) {
        window.localStorage.setItem("user_name", queries.userName);
      }
    }
  }
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
