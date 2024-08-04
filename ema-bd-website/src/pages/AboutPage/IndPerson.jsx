import Charles from '../../Assets/images/Charles.jpeg';
import './IndPerson.css'; // Import the CSS file for styling

const IndPerson = () => {
    return (
        <div className="ind-person-container mt keynote">
            <div className="image-container">
                <img src={Charles} alt="Charles Whiteley" className="ambassador-image"/>
            </div>
            <h2 className="text-center">Keynote</h2>
            <div className="speech-container">
                <p className="mt-10">
                    <h4>Dear members of the Erasmus Mundus Association-Bangladesh (EMA-BD),</h4><br/>
                    It is with great pleasure and enthusiasm that I address you today on the transformative power 
                    of Erasmus+ educational opportunities and cross-cultural exchange. <br/>
                </p>
                <p>
                    Erasmus Mundus has long been a beacon of academic excellence and cultural diversity, 
                    fostering mutual understanding and collaboration across borders. As we navigate a rapidly 
                    changing global landscape, the importance of international education and intercultural dialogue 
                    cannot be overstated. These experiences not only enrich individual lives but also strengthen the 
                    foundation of our societies by promoting tolerance, empathy, and global citizenship. <br/>
                </p>
                <p>
                    <br/>
                    The Erasmus+ programme embodies the European Union&quot;s commitment to fostering 
                    educational mobility and enhancing cooperation between institutions worldwide. It provides 
                    students, academics, and professionals with invaluable opportunities to study, teach, and 
                    collaborate in diverse cultural settings, thereby broadening their perspectives and preparing 
                    them to tackle global challenges.<br/>
                </p>
                <p>
                    For students and professionals in Bangladesh, engaging with Erasmus+ opens doors to 
                    academic excellence, innovative research, and personal growth. It offers a platform to exchange 
                    ideas, knowledge, and best practices with peers from different backgrounds, laying the 
                    groundwork for future leaders and change-makers. <br/>
                </p>
                <p>
                    As we look ahead, I encourage each of you to seize the opportunities that Erasmus Mundus 
                    presents. Embrace the chance to broaden your horizons, challenge your assumptions, and forge 
                    lasting connections across continents. Your participation not only enhances your own career 
                    prospects but also contributes to building a more interconnected and prosperous world.
                    I commend the Erasmus Mundus Association-Bangladesh for its dedication to promoting 
                    educational excellence and international cooperation. Your commitment to advancing 
                    Erasmus+ and fostering a vibrant community of learners and leaders. Furthermore, the launch 
                    of the EMA-BD website will serve as a pivotal platform for connecting our community, sharing 
                    resources, and expanding opportunities for academic and cultural exchange. <br/>
                </p>
                <p>
                    Together, let us celebrate the achievements of Erasmus Mundus and rededicate ourselves to 
                    building a brighter future through education, understanding, and shared humanity.
                    Thank you for your commitment to Erasmus+, and I look forward to witnessing the continued 
                    success and impact of EMA-BD. <br/>
                </p>
                <p>
                    Thank you. <br/>
                    Charles WHITELEY<br/>
                    Ambassador and Head of Delegation<br/>
                    European Union Delegation to Bangladesh
                </p>
            </div>
        </div>
    );
};

export default IndPerson;
