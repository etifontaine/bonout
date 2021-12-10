import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";

interface questionContent {
  title: string;
  answer: string;
}

function Question({ title, answer }: questionContent) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-full py-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="font-montserrat font-medium mr-auto">{title}</div>
          <Image
            src="/images/CaretRight.svg"
            alt="Caret"
            height="58"
            width="58"
            className={`transform transition-transform ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        </div>
        <div
          className={`font-montserrat text-sm font-extralight pb-8 ${
            isOpen ? "" : "hidden"
          }`}
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
      <hr className="w-full bg-white" />
    </>
  );
}

function FAQ() {
  const { t } = useTranslation("faq");

  return (
    <section className="sectionSize items-start pt-8 md:pt-36 bg-black text-white">
      <div>
        <h2 className="secondaryTitle bg-highlight3 p-10 mb-0 bg-center bg-100%">
          {t("title")}
        </h2>
      </div>
      <Question
        answer={t("howIsItDifferent.answer")}
        title={t("howIsItDifferent.title")}
      />
      <Question
        answer={t("howToInvite.answer")}
        title={t("howToInvite.title")}
      />
      <Question
        answer={t("howIsItFinanced.answer")}
        title={t("howIsItFinanced.title")}
      />
      <Question
        answer={t("isAccountRequired.answer")}
        title={t("isAccountRequired.title")}
      />
      <Question
        answer={t("howToSaveUserID.answer")}
        title={t("howToSaveUserID.title")}
      />
      <Question
        answer={t("isThereAnApp.answer")}
        title={t("isThereAnApp.title")}
      />
    </section>
  );
}

export default FAQ;
