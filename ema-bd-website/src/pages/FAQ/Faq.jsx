
import Accordion from '../../components/Accordion/Accordion';
import './Faq.css';

const Faq = () => {
    return (
        <div>
             <div className='faq-wrapper'>
             <h1 className='section-header text-center'>Frequently Asked Questions</h1>
             <Accordion title="What is Erasmus Mundus Scholarship Requirements ?" content="Students must have a bachelor's level education from their respective countries. Students studying in the first year of their higher degree program can apply for this course if they can graduate before the master's program starts"></Accordion>
             <Accordion title="How much scholarship can i get from erasmus mundus scholarship ?" content="This is due to the fact that Erasmus Mundus was designed for non-EU citizens and only in recent years has it come to include EU citizens. The Master's scholarship can get up to 48,000 EUR for two years of study, and this covers: The tuition fees (if there are any) Health insurance."></Accordion>
             <Accordion title="Do i need ielts to get erasmus mundus scholarship ?" content="A minimum English language qualification of English B/English 6 at upper secondary level or the equivalent level of an internationally recognized test, for example, TOEFL, IELTS, or equivalent alternatives as stated in the call for applications each year"></Accordion>
             <Accordion title="When is the application time for erasmus mundus scholarship ?" content="In most cases, you should submit your application between October and January for courses starting the following academic year."></Accordion>
           </div>

        </div>
    );
};

export default Faq;