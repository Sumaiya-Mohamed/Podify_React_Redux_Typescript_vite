import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Carousal } from './components/Carousal'
import { FilterBar } from './components/Filter-bar';
import { PodcastPreview } from './components/Podcast-Preview';
//import  { ShowPreview } from './components/Show-Preview'
 

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
 
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response: Response = await fetch('https://podcast-api.netlify.app/shows');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const json = await response.json() as ShowOriginalData;
        setPodcastData(json)
      }
      catch (error) {
        console.log('Error fetching data:', error);
      }
    };
    
    void fetchData();

    // I did not include a clean up function because this data will be used through out my app.
  }, []);

    const showId = podcastData.flatMap((show) =>{
        return(
          show.id
        )
    })
  
  return (
    <div>
      <Header />
      <br></br>
      <Carousal 
       data = {podcastData} 
      />
      <br></br>
      <FilterBar />
      <PodcastPreview
       data= {podcastData}
      showIds={showId}
      />
    </div>
  );
}




