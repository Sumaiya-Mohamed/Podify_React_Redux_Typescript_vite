import React from "react";
import Slider, { Settings } from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type Show = {
  id: string;
  title: string;
  description: string;
  image: string;
};

type CarouselProps = {
  data: Show[];
};

/* <div className="carousal__information">
              <h3 className="carousal__title">{show.title}</h3>
              <p className="carousal__description">{show.description}</p>
             </div> 
    this is the other information i took out and left here incase i need it again*/ 

    export const Carousal: React.FC<CarouselProps> = ({ data }) => {
  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,

  };

  return (
    <div className="carousal__container">
      <Slider {...settings}>
        {data.map((show, index) => (
          <div key={show.id} className="carousal__slide">
             <img className="carousal__img" src={show.image} alt={show.title} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousal;
