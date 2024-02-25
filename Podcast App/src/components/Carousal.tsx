import React, {useEffect,useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setToken } from '../store/tokenSlice';
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
    const [promoShows,setPromoShows] = useState<ShowPreview>([])
    const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  
  const token = useSelector((state: RootState) => state.token)
 
  useEffect(() => {
    let count = 0;
   
    const generatePromoShows = () => {
      if (count < 7) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const topShow = data[randomIndex];
        setPromoShows(prevPromoShows => [...prevPromoShows, topShow]);
        count++;
      } else {
        clearInterval(interval);
      }
    };
  
    const interval = setInterval(generatePromoShows, 1000);
    
    return () => clearInterval(interval);
    
  }, [data]);

  
  return (
    <div>
      <div className="carousal__container">
        <div className="carousal__top">
          <h3> Top picks for you today</h3>
        </div>
      <Slider {...settings}>
        {promoShows.map((show) => {

          return (
            
            <div key={show?.id} className="carousal__slide">
              <div className="carousal__info">
              
              <img className="carousal__img" src={show?.image} alt={show?.title} />
             
              <div className="carousal__information">
                <h3 className="carousal__title">{show?.title}</h3>
                <h3 className="carousal__seasons">Seasons: {show?.seasons}</h3>
              </div>
              </div>
            </div>

          );
        })}
      </Slider>
      </div>
  </div>
  );
};

