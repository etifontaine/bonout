import React from "react";
import { useTranslation } from 'next-i18next';

function Features() {
  const { t } = useTranslation('landing');
  return (
    <section className="sectionSize bg-secondary">
      <div>
        <h2 className="secondaryTitle bg-underline3 bg-100%">
          {t('features.title')}
        </h2>
      </div>
      <div className="md:grid md:grid-cols-2 md:grid-rows-2">
        <div className="flex items-start font-montserrat my-6 mr-10">
          <img
            src="images/Heart.svg"
            alt="Heart"
            width="24"
            height="24"
            className="h-7 mr-4"
          />
          <div>
            <h3 className="font-semibold text-2xl">{t('features.first.title')}</h3>
            <p>{t('features.first.content')}</p>
          </div>
        </div>

        <div className="flex items-start font-montserrat my-6 mr-10">
          <img
            src="images/Heart.svg"
            alt="Heart"
            width="24"
            height="24"
            className="h-7 mr-4"
          />
          <div>
            <h3 className="font-semibold text-2xl">{t('features.second.title')}</h3>
            <p>{t('features.second.content')}</p>
          </div>
        </div>

        <div className="flex items-start font-montserrat my-6 mr-10">
          <img
            src="images/Heart.svg"
            alt="Heart"
            width="24"
            height="24"
            className="h-7 mr-4"
          />
          <div>
            <h3 className="font-semibold text-2xl">
              {t('features.third.title')}
            </h3>
            <p>{t('features.third.content')}</p>
          </div>
        </div>

        <div className="flex items-start font-montserrat my-6 mr-10">
          <img
            src="images/Heart.svg"
            alt="Heart"
            width="24"
            height="24"
            className="h-7 mr-4"
          />
          <div>
            <h3 className="font-semibold text-2xl">{t('features.fourth.title')}</h3>
            <p>{t('features.fourth.content')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
