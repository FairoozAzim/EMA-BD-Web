import React from 'react';
import './IndPerson.css'; // Import the CSS file for styling
import { useParams } from 'react-router-dom';
import Eud from './EUD_dets.jsx';
import CRs from './CR_dets.jsx';

const IndPerson = () => {
    const { name } = useParams();
    let item = Eud.find(item => item.name === name);
      // If the item is not found in Eud, check CRs
    if (!item) {
        item = CRs.find(item => item.name === name);
    }
    
    return (    
        <div className="keynote">
             <h2 className="text-center">Keynote from {name}</h2>
            <div className='ind-person-container d-flex'>
            <div className="image-container">
                <img src={item.image} alt="Charles Whiteley" className="ambassador-image"/>
                <div>
                    <h3>{name}</h3>

                </div>

            </div>
           
            <div className="speech-container">
                <h4>{item.highlight}</h4>
                <p className='about-details'>
                                    {item.keynote.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            <br/>
                                        </React.Fragment>
                                    ))}
                                </p>
            
                
            </div>
            </div>
        </div>
    );
};

export default IndPerson;
