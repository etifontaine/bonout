import { useTranslation } from "next-i18next";
import React from "react";

function HowItWorks() {
  const { t } = useTranslation("landing");
  return (
    <section className="bg-black text-white sectionSize">
      <div>
        <h2 className="secondaryTitle bg-underline2 bg-100%">
          {t("howItWorks.howDoesItWork")}
        </h2>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 mx-8 flex flex-col items-center my-4">
          <div className="border-2 rounded-full bg-secondary text-black h-12 w-12 flex justify-center items-center mb-3">
            1
          </div>
          <h3 className="font-montserrat font-medium text-xl mb-2">
            {t("howItWorks.create")}
          </h3>
          <p className="text-center font-montserrat">
            {t("howItWorks.create_content")}
          </p>
        </div>
        <div className="flex-1 mx-8 flex flex-col items-center my-4">
          <div className="border-2 rounded-full bg-secondary text-black h-12 w-12 flex justify-center items-center mb-3">
            2
          </div>
          <h3 className="font-montserrat font-medium text-xl mb-2">
            {t("howItWorks.share")}
          </h3>
          <p className="text-center font-montserrat">
            {t("howItWorks.share_content")}
          </p>
        </div>
        <div className="flex-1 mx-8 flex flex-col items-center my-4">
          <div className="border-2 rounded-full bg-secondary text-black h-12 w-12 flex justify-center items-center mb-3">
            3
          </div>
          <h3 className="font-montserrat font-medium text-xl mb-2">
            {t("howItWorks.organise")}
          </h3>
          <p className="text-center font-montserrat">
            {t("howItWorks.organise_content")}
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
