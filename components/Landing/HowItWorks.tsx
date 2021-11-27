import React from "react";

function HowItWorks() {
  return (
    <section className="bg-black text-white sectionSize">
      <div>
        <h2 className="secondaryTitle bg-underline2 bg-100%">Comment ça marche</h2>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 mx-8 flex flex-col items-center my-4">
          <div className="border-2 rounded-full bg-secondary text-black h-12 w-12 flex justify-center items-center mb-3">
            1
          </div>
          <h3 className="font-montserrat font-medium text-xl mb-2">Créer</h3>
          <p className="text-center font-montserrat">
            Créer ton événements en quelques clics, sans inscrition et
            gratuitement!
          </p>
        </div>
        <div className="flex-1 mx-8 flex flex-col items-center my-4">
          <div className="border-2 rounded-full bg-secondary text-black h-12 w-12 flex justify-center items-center mb-3">
            2
          </div>
          <h3 className="font-montserrat font-medium text-xl mb-2">Partage</h3>
          <p className="text-center font-montserrat">
            Envoi ton lien unique à tes amis pour les inviter.
          </p>
        </div>
        <div className="flex-1 mx-8 flex flex-col items-center my-4">
          <div className="border-2 rounded-full bg-secondary text-black h-12 w-12 flex justify-center items-center mb-3">
            3
          </div>
          <h3 className="font-montserrat font-medium text-xl mb-2">Organise</h3>
          <p className="text-center font-montserrat">
            Suis les réponses et commentaires pour finaliser ton organisation.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
