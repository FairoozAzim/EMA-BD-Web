import faq from "../../Assets/faq.json";
import Accordion from "../../components/Accordion/Accordion";
import "./Faq.css";

const Faq = () => {
  return (
    <div>
      <div className="faq-wrapper mt-10 max-w-7xl mx-auto px-4 md:px-2">
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl text-center">
          Frequently Asked Questions
        </h1>
        <div className="mt-10">
          {faq.map((faq, index) => (
            <Accordion key={index} title={faq.question} content={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
