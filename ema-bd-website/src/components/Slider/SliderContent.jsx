
const SliderContent = ({activeIndex, sliderImage}) => {
    return (

        <section className="">
            {
            sliderImage.map((slide, index)=> (
                <div
                key={index}
                className= {index === activeIndex ? "slides-active" : "inactive"}
                >
                <div className="slides-content d-flex">
                <div className="slide-text">
                <h4>{slide.name}</h4>
                <p>{slide.text}</p>
                </div>

                <div className="slide-image-container">
                <img className='slide-image' src={slide.url}></img>
                </div>
                </div>
                </div>
            ))}

        </section>
    );
};

export default SliderContent;