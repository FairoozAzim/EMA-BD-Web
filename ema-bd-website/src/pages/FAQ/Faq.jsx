import faq from "../../Assets/faq.json";
import Accordion from "../../components/Accordion/Accordion";
// import "./Faq.css";

const Faq = () => {
  return (
    <div>
      <div className="faq-wrapper max-w-7xl mx-auto px-4 md:px-2">
        <h1 className="text-center mt-5 text-3xl font-semibold tracking-tight text-[#0F2A5F] md:text-5xl">
          Frequently Asked Questions
        </h1>

        <p className="text-center mx-auto mt-4 max-w-2xl text-xs text-slate-600 md:text-base">
          Find answers to the most common questions about EMA BD and our
          community.
        </p>
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
