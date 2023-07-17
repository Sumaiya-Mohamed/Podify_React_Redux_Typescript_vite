import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Carousal } from './components/Carousal'
import { FilterBar } from './components/Filter-bar';
import { PodcastPreview } from './components/Podcast-Preview';
import { ShowPreview } from './components/Show-Preview';
//import  { ShowPreview } from './components/Show-Preview'
 

type ShowPreview = {
  id: string;
  title: string;
  description: string;
  image: string;
  seasons: number;
  genres: number[];
  updated: Date;
};

type Show = {
  id: string;
  title: string;
  description: string;
  seasons: object[];
  episodes: object[];
};

type Season = {
  title: string;
  image: string;
  episodes: object[];
};

type Episode = {
  title: string;
  description: string;
  episode: number;
  file: string;
};

type Dialog = boolean;

export const App: React.FC = () => {
  const [podcastData, setPodcastData] = useState<ShowPreview[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<Dialog>(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: Response = await fetch('https://podcast-api.netlify.app/shows');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: ShowPreview[] = await response.json();
        setPodcastData(json);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    void fetchData();
  }, []);

  useEffect(() => {
    const fetchShowDetails = async (showId: string) => {
      try {
        const response: Response = await fetch(`https://podcast-api.netlify.app/shows/${showId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch show details');
        }
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const showDetails: Show = await response.json();
        setSeasons(showDetails.seasons as Season[]);
        setEpisodes(showDetails.episodes as Episode[]);
      } catch (error) {
        console.log('Error fetching show details:', error);
      }
    };

    if (isDialogOpen) {
      podcastData.forEach((show) => {
        void fetchShowDetails(show.id);
      });
    }
  }, [isDialogOpen, podcastData]);

 /* const displayShowPreview = (dialog: boolean,season: object,episode: object) =>{
     setIsDialogOpen(true);
     return(
       
       <div>
          <div>episode</div>
       </div>
     )
  }*/

  return (
    <div>
      <Header />
      <br></br>
      <Carousal 
       data= {podcastData}
      />
      <br></br>
      <FilterBar />
      <PodcastPreview
       data= {podcastData}
       dialog = {isDialogOpen}
       season={seasons}
       episode={episodes}
      />
    </div>
  );
}




