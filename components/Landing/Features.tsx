import React from "react";

function Features() {
  return (
    <section className="sectionSize bg-secondary">
      <div>
        <h2 className="secondaryTitle bg-underline3 bg-100%">
          Fonctionnalités
        </h2>
      </div>
      <div className="md:grid md:grid-cols-2 md:grid-rows-2">
        <div className="flex items-start font-montserrat my-6 mr-10">
          <img src="images/Heart.svg" alt="" className="h-7 mr-4" />
          <div>
            <h3 className="font-semibold text-2xl">Feature #1</h3>
            <p>
              Créer ton événement en lui donnant un nom, une description, une
              date et un lieu. En quelques secondes tu pourra inviter tout tes
              potes! Le tout sans inscription et gratuitement! Plus besoin que
              tes potes aient un compte Facebook pour les inviters à tes
              événements.
            </p>
          </div>
        </div>

        <div className="flex items-start font-montserrat my-6 mr-10">
          <img src="images/Heart.svg" alt="" className="h-7 mr-4" />
          <div>
            <h3 className="font-semibold text-2xl">Feature #2</h3>
            <p>
              Partage ton événement par messagerie, mail ou QRCode, grâce à ton
              lien unique! Seul les personnes avec ton lien pourront accéder à
              ton événement.
            </p>
          </div>
        </div>

        <div className="flex items-start font-montserrat my-6 mr-10">
          <img src="images/Heart.svg" alt="" className="h-7 mr-4" />
          <div>
            <h3 className="font-semibold text-2xl">Feature #3</h3>
            <p>
              Vie privée et respect de l'utilisateur! Ce sont des valeurs
              essentielles chez Bonout. Nous n'avons pas de tracker ou cookie
              sur le site afin de vous respecter.
            </p>
          </div>
        </div>

        <div className="flex items-start font-montserrat my-6 mr-10">
          <img src="images/Heart.svg" alt="" className="h-7 mr-4" />
          <div>
            <h3 className="font-semibold text-2xl">Feature #4</h3>
            <p>
              Tu peux gérer tout ton événement depuis Bonout! Invite tes amis,
              utilise les commentaires pour communiquer avec eux et créer des
              listes pour vous organiser.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
