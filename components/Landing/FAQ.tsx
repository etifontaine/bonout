import React, { useState } from "react";
import Image from "next/image";

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
            className={`transform transition-transform ${isOpen ? "rotate-90" : ""
              }`}
          />
        </div>
        <div
          className={`font-montserrat text-sm font-extralight pb-8 ${isOpen ? "" : "hidden"
            }`}
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
      <hr className="w-full bg-white" />
    </>
  );
}

function FAQ() {

  return (
    <section className="sectionSize items-start pt-8 md:pt-36 bg-black text-white">
      <div>
        <h2 className="secondaryTitle bg-highlight3 p-10 mb-0 bg-center bg-100%">
          FAQ
        </h2>
      </div>
      <Question
        title="En quoi Bonout est différent?"
        answer="Bonout te permet d'organiser tes événements sans créer de compte, sans cookies, on respecte ta vie privée!"
      />
      <Question
        title="Comment inviter des gens à mon événement?"
        answer="Une fois ton évènement crée, tu vas obtenir un lien unique. Partage ton lien par messagerie ou transforme le en QRCode afin d'inviter qui tu veux."
      />
      <Question
        title="Mes invités doivent-ils avoir un compte Bonout?"
        answer="Non, tu peux juste partager le lien de ton évènement et ils pourront répondre avec un pseudo ou leur nom."
      />
      <Question
        title="Comment je fais pour me souvenir de mon identifiant?"
        answer="Tu peux l'enregistrer dans ton gestionnaire de mot de passe ou dans une note. Sinon, tu peux en recréer un nouveau lors de ton prochain événement!"
      />
      <Question
        title="Existe-t-il une app Bonout?"
        answer="Pas pour l'instant. Si de plus en plus de monde utilise Bonout on pourra en créer une avec plaisir!"
      />
    </section>
  );
}

export default FAQ;
