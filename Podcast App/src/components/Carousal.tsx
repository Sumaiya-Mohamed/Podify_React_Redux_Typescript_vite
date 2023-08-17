import React from "react";
import Slider, { Settings } from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type ShowPreview = Array<Show>

type Show = {
  id: string;
  title: string;
  description: string;
  image: string;
  seasons: number | Array<Seasons>;
  genres: Array<number>;
  updated: Date;
};

type Seasons = [
  season: number,
  title: string,
  image: string,
  episodes: Array<Episodes>,
]

type Episodes = [
  title: string,
  description: string,
  episode: number,
  file: string,
];

type CarouselProps = {
  data: ShowPreview;
};


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
    <div>
      <h3 className="carousal__heading">You may be interested in...</h3>
      <div className="carousal__container">
      <Slider {...settings}>
        {data.map((show) => {

          return (
            
            <div key={show.id} className="carousal__slide">
              <img className="carousal__img" src={show.image} alt={show.title} />
              <div className="overlay"></div>
              <div className="carousal__information">
                <h3 className="carousal__title">{show.title}</h3>
                <h3 className="carousal__seasons">Seasons: {show.seasons}</h3>
              </div>
            </div>
          );
        })}
      </Slider>
      </div>
  </div>
  );
};

