import React, { useState, useEffect } from 'react';
import { NavBar } from './components/NavBar'
import { Carousal } from './components/Carousal'
import { PodcastPreview } from './components/Podcast-Preview'
import { Footer } from './components/Footer'
import {CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { IdSlice, resetId } from './store/IdSlice';
import {tokenSlice, resetToken} from './store/tokenSlice'
import { favoriteShowSlice } from './store/favoriteShowSlice'; 
import { RootState } from './store/store';
import { useNavigate } from 'react-router-dom';
import { LogIn } from './pages/LogIn';
import { FavoritesPage } from './pages/FavoritesPage';
import { FilterBar } from './components/Filter-bar';
//import { setUsers } from './store/Users';
import { supabase } from './Client';
import { SupabaseClient } from '@supabase/supabase-js';
import { SignUp } from './pages/SignUp';


type ShowOriginalData = Array<Show>

type ShowPreview = {
  id: string;
  title: string;
  description: string;
  image: string;
  seasons: Seasons;
  genres: Array<string>;
  updated: Date;
};


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
  const [isfetched, setIsFetched] = useState<boolean>(true);
  const [page, setPage] = useState<string>('Home')
  const [userInfo,setUserInfo] = useState({
    name: '',
    id: '',
    favorites: []
  })
  
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const id = useSelector((state: RootState) => state.id)
  const token = useSelector((state: RootState) => state.token)
  const userData = useSelector((state: RootState) => state.users)
  const favorites = useSelector((state: RootState) => state.favoriteShow)

  useEffect(() => {
    if(!token && !id){
      navigate('/pages/LogIn')
    }
  }, [token, id, navigate])

  
  
  

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
    setIsFetched(true)
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
    
    setIsFetched(false)
    return () => clearInterval(interval);
    
  }, [podcastData]);

 
    const showId = podcastData.flatMap((show) =>{
        return(
          show.id
        )
    })
  
  
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
         {isLoading ? (
            <div className="loading__promocontainer">
            <CircularProgress size={30} color="inherit" className="loading__open"/> 
           </div> 
         ) : (
          <div>
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
         )}
         
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
              <img src='../icons/hero.jpg' alt='hero image'></img>
              <div className='banner'>
                <h3>Browse over 100+ shows</h3>
              </div>
            </div>
           <PodcastPreview
           data= {podcastData}
           setUserInfo = {setUserInfo}
           userInfo = {userInfo}
          />
       
          </div>
             
          )}
          </div>
          }
          {page === 'LogIn' && 
          <LogIn 
          setPage = {setPage}
          setUserInfo = {setUserInfo}
          userInfo = {userInfo}
          />}
          {page === 'Favorites' && <FavoritesPage />}
          {page === 'SignUp' && 
          <SignUp
            setUserInfo = {setUserInfo}
            userInfo = {userInfo}
            setPage = {setPage}
          />}
          </div>
          
    
</div>
  
  )
}