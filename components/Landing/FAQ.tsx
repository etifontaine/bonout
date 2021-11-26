import React from "react";

function Question() {


  // toggle.addEventListener("click", function (event) {
  //   console.log(toggle);
  //   const answerElement = toggle.querySelector("[answer]");
  //   const caretElement = toggle.querySelector("img");
  //   console.log(answerElement);
  //   if (answerElement.classList.contains("hidden")) {
  //     answerElement.classList.remove("hidden");
  //     caretElement.classList.add("rotate-90");
  //   } else {
  //     answerElement.classList.add("hidden");
  //     caretElement.classList.remove("rotate-90");
  //   }
  // });

  return (
    <>
      <div onClick={() => console.log("test")} className="w-full py-4">
        <div className="flex justify-between items-center">
          <div className="font-montserrat font-medium mr-auto">
            En quoi Bonout est différent?
          </div>
          <img src='images/CaretRight.svg' alt="" className="transform transition-transform" />
        </div>
        <div className="font-montserrat text-sm font-extralight pb-8 hidden">
          You can download it on Gumroad.com
        </div>
      </div>
      <hr className="w-full bg-white" />
    </>
  )
}

function FAQ() {

  return (
    <section className="sectionSize items-start pt-8 md:pt-36 bg-black text-white">
      <div>
        <h2 className="secondaryTitle bg-highlight3 p-10 mb-0 bg-center bg-100%">
          FAQ
        </h2>
      </div>

      <Question />

    </section>
  );
}

export default FAQ;
