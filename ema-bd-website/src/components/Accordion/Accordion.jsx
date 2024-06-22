import { useState } from 'react';
import './Accordion.css';
import { MdOutlineExpandMore } from 'react-icons/md';

const Accordion = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion">
      <div className="accordion-header" onClick={toggleAccordion}>
        <h4 className="accordion-title">{title}</h4>
        <span className={`accordion-icon ${isOpen ? 'open' : ''}`}><MdOutlineExpandMore /></span>
      </div>
      {isOpen && <div className="accordion-content">{content}</div>}
    </div>
  );
};

export default Accordion;
