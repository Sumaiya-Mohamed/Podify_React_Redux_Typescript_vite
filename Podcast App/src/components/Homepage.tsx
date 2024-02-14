import React, { useState, useEffect } from 'react';
import { Header } from './Header'
import { Carousal } from './Carousal'
import { PodcastPreview } from './Podcast-Preview'
import { Footer } from './Footer'
import {CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { IdSlice, resetId } from '../store/IdSlice';
import {tokenSlice, resetToken} from '../store/tokenSlice'
import { favoriteShowSlice } from '../store/favoriteShowSlice'; 
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { LogIn } from '../pages/LogIn';
//import { setUsers } from './store/Users';
import { supabase } from '../Client';
import { SupabaseClient } from '@supabase/supabase-js';


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



export const Homepage: React.FC = () => {
  const [podcastData, setPodcastData] = useState<ShowOriginalData>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
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

 
    const showId = podcastData.flatMap((show) =>{
        return(
          show.id
        )
    })

   
  return (
    <div>
        {isLoading ? (
          <div className="loading__container">
          <CircularProgress size={40} color="inherit" className="loading__open"/> 
         </div> 
          ) : ( 
         <div>
          <Header />
          <br></br>
          <Carousal 
           data = {podcastData} 
          />
          <br></br>
          <PodcastPreview
           data= {podcastData}
          />
          <Footer/>
          
         </div>
         )
       }
  </div>
  
  )
}


