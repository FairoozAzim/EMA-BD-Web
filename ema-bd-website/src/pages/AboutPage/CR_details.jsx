import React from "react";
import { Link } from "react-router-dom";
import CRData from './CR_dets';


const CR_details = () => {
    return (
        <div>
             <div className="mt keynote-ch">
                <h1 className=''>EMA-BD Country Representatives</h1>
                {
                    CRData.map((item, index)=> (
                    <div className="card-wrapper" key={index}>
                        <div className='d-flex'>
                       <div className='person-img'>
                       <img src ={item.image}/>
                       </div>
                       <div className='person-spch'>
                        <h3>{item.name}</h3>
                        <p>Active Period: {item.year}</p>
                        <h4 className="about-highlight">{item.highlight}</h4>
                        <p className='about-details'>
                                    {item.keynote.slice(0, 400).split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                        </React.Fragment>
                                    ))}...
                                </p>
                          <Link to={`/keynote/${item.name}`}> <button className='btn-red'>Read More</button></Link>
                        </div>
                       </div>
                    </div>

                    ))
                }
          
            </div>
        </div>
    );
};

export default CR_details;