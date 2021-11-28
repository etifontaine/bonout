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
          <img
            src="images/Heart.svg"
            alt="Heart"
            width="24"
            height="24"
            className="h-7 mr-4"
          />
          <div>
            <h3 className="font-semibold text-2xl">Prépare un événement</h3>
            <p>
              Prépare ton événement en lui donnant un nom, une description, une
              date et un lieu. En quelques secondes tu pourras le partager à
              tout tes invités! Le tout sans inscription et gratuitement! Plus
              besoin d'avoir un compte sur chaque réseau social pour inviter
              tout le monde.
            </p>
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
            <h3 className="font-semibold text-2xl">Invitations</h3>
            <p>
              Partage ton événement par messagerie, mail ou QRCode, grâce à ton
              lien unique! Seul les personnes avec ton lien pourront trouver ton
              événement.
            </p>
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
              Vie privée & respect de l'utilisateur
            </h3>
            <p>
              Ce sont des valeurs essentielles chez Bonout. Nous n'avons pas de
              trackers ou cookies sur le site, car il n'y en a pas besoin pour
              vous laisser organiser vos événements dans de bonnes conditions.
            </p>
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
            <h3 className="font-semibold text-2xl">Organisation</h3>
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
