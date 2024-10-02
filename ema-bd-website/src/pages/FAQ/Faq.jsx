import faq from '../../Assets/faq.json'
import Accordion from '../../components/Accordion/Accordion';
import './Faq.css';

const Faq = () => {
    return (
        <div>
             <div className='faq-wrapper mt-10'>
             <h1 className='section-header text-center'>Frequently Asked Questions</h1>
             <div className='mt-10'>
             {faq.map((faq, index) => (
         
               <Accordion
                 key={index}
                 title={faq.question}
                 content={faq.answer}
               />
             ))}
           </div>
           </div>

        </div>
    );
};

export default Faq;