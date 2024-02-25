import React, { useState, useEffect } from 'react';
import { NavBar } from './components/NavBar'
import { PodcastPreview } from './pages/HomePage'
import {CircularProgress } from '@mui/material';
import { LogIn } from './pages/LogIn';
import { FavoritesPage } from './components/FavoritesPage';
import { SignUp } from './pages/SignUp';


type ShowOriginalData = Array<Show>


type Show = {
  id: string;
  title: string;
  description: string;
  image: string;
  seasons: number;
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



export const App: React.FC = () => {
  const [podcastData, setPodcastData] = useState<ShowOriginalData>([]);
  const [promoShows,setPromoShows] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<string>('Home')
  
  

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response: Response = await fetch('https://podcast-api.netlify.app/shows');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const json = await response.json() as ShowOriginalData;
        setPodcastData(json)

         // Set isLoading to false after data fetching is complete.
         setIsLoading(false);
      }
      catch (error) {
        console.log('Error fetching data:', error);
         setIsLoading(false);
      }
    };
    
    void fetchData();

  }, []);

  useEffect(() => {
    let count = 0;
    const generatePromoShows = () => {
      if (count < 5) {
        const randomIndex = Math.floor(Math.random() * podcastData.length);
        const topShow = podcastData[randomIndex];
        if(topShow !== undefined){
        setPromoShows(prevPromoShows => [...prevPromoShows, topShow]);
        count++;
        }
      } else {
        clearInterval(interval);
      }
    };
  
    const interval = setInterval(generatePromoShows, 1000);
    
    return () => clearInterval(interval);
    
  }, [podcastData]);

 

  return (
    <div className='main__layout'>
          <div className='box1'>
           <NavBar 
           setPage = {setPage}
           page = {page}
           />
          </div>
        
          <div className='box2'>
          <h3 className='top__picks'> Top picks for you today</h3>
          <div className='buttons__container'>
          {promoShows?.map((show,index) => (
            <div key={index} className='top__container'>
              <button className={'top__preview'}>
                <div className='container'>
               <img className={'top__img '}
               src={show?.image} alt={show?.title} />
               </div>
               <div className="top__content">
               <h3 className="top__title">{show?.title}</h3>
                 
                 <h3 className='top__seasons'> Seasons:{show?.seasons}</h3>
                 <p className='top__updated'>Updated:  {new Date(show?.updated).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
               </div>
              
             </button>
            
            </div>
          ))}
         
      </div>
          </div>
          
          <div className='box3'>
          {page === 'Home' && 
          <div>
          {isLoading ? (
          <div className="loading__container">
          <CircularProgress size={40} color="inherit" className="loading__open"/> 
         </div> 
          ) : ( 
           <div>
            <div className='hero__container'> 
              <img src='../public/hero.jpg' alt='hero image'></img>
              <div className='banner'>
                <h3>Browse over 100+ shows</h3>
              </div>
            </div>
              <PodcastPreview
               data= {podcastData}
               />
            </div>
        )}
          </div>
          }

          {page === 'LogIn' && 
          <LogIn 
          setPage = {setPage}
          />}
          {page === 'Favorites' && <FavoritesPage />}
          {page === 'SignUp' && 
          <SignUp
            setPage = {setPage}
          />}
          </div>
          
    
</div>
  
  )
}