import React, {useState} from "react";
import Image from "next/image"
import { questions } from "content/faq";

interface questionContent {
    title: string,
    answer: string
}

function Question({title, answer}: questionContent) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)} className="w-full py-4">
        <div className="flex justify-between items-center cursor-pointer">
          <div className="font-montserrat font-medium mr-auto">
          {title}
          </div>
          <Image
            src="/images/CaretRight.svg"
            alt="Caret"
            height="58"
            width="58"
            className={`transform transition-transform ${isOpen ? 'rotate-90' :  ''}`}
          />
        </div>
        <div className={`font-montserrat text-sm font-extralight pb-8 ${isOpen ? '' :  'hidden'}`}>
          {answer}
        </div>
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
    {
        questions.map((question, key) => {
            return <Question key={key} answer={question.answer} title={question.title} />
        })
    }
      
    </section>
  );
}

export default FAQ;
