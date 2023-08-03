import React, {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store/store';
import { FilterBar } from './FavoritesFilterBar';
import { Footer } from './Footer';
import { addToEpisodeFavorites, clearEpisodeFavorites } from '../store/favoriteEpisodesSlice';
import { addToShowFavorites, removeFromShowFavorites, clearShowFavorites } from '../store/favoriteShowSlice';
import AudioPlayer from 'react-h5-audio-player';
import CloseIcon from '@mui/icons-material/Close';


type FavoriteShowData = Array<FavoriteShow>;
type FavoriteEpisodeData = Array<Episodes>;

type SelectedShow = {
  id: string;
  title: string;
  description: string;
  image: string;
  seasons: Array<{
    season: number;
    title: string;
    image: string;
    episodes: Array<{
      title: string;
      description: string;
      episode: number;
      file: string;
    }>;
  }>;
  genres: Array<string>;
  updated: Date;
};

type FavoriteShow = {
  id: string;
  title: string;
  description: string;
  image: string;
  seasons: Array<{
    season: number;
    title: string;
    image: string;
    episodes: Array<{
      title: string;
      description: string;
      episode: number;
      file: string;
    }>;
  }>;
  genres: Array<string>;
  updated: Date;
  favoriteEpisodeData: FavoriteEpisodeData;
};



type ShowPreview = {
  id: string;
  title: string;
  description: string;
  image: string;
  seasons: Seasons;
  genres: Array<string>;
  updated: Date;
};

type Seasons = Array<{
  season: number;
  title: string;
  image: string;
  episodes: Array<{
    title: string;
    description: string;
    episode: number;
    file: string;
  }>;
}>;

type Episodes = {
  title: string,
  description: string,
  episode: number,
  file: string,
  addedAt: string; 
};


export const FavoritesPage: React.FC = () => {
  const favoriteEpisode = useSelector((state: RootState) => state.favoriteEpisode);
  const favoriteShow = useSelector((state:RootState) => state.favoriteShow)
  const dispatch = useAppDispatch(); // Use the useDispatch hook
  const [dialogOpen, setDialogOpen] = useState<boolean> (false);   // A boolean value to toggle the dialog between open and close.
  const [selectedShow, setSelectedShow] = useState<FavoriteShow> ()   // State that stores a specific shows data to be displayed on the dialog when a that show is selected.
  const [selectedSeasons, setSelectedSeasons] = useState <Seasons> ()   // Stores the seasons of the selected show.
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState< number | undefined> (0);//Index used to keep track of the active shows information.
  const [currentEpisodeUrl, setCurrentEpisodeUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // This will be used to pause and play the audio.
  const [allFavoriteShows, setAllFavoriteShows] = useState<FavoriteShowData>([])
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [savedEpisodes, setSavedEpisodes] = useState<FavoriteEpisodeData>()
  
  const [renderedShows, setRenderedShows] = useState<string[]>(() => {
    // Initialize with the IDs of all favorite shows' data
    return favoriteShow.map((show) => show.id);
  });

  const [sortOption, setSortOption] = React.useState<string>('');
  const audioRef = useRef(null);

  const navigate = useNavigate();

  const backToHome = () => {
    navigate('/');
  };

  
  
  const handleSearch = (query: string) => {
    const filteredShows = favoriteEpisode.filter((episode) =>
      episode.title.toLowerCase().includes(query.toLowerCase())
    );

    // If the search query is empty, reset filteredShows to an empty array
    dispatch(clearEpisodeFavorites());
    filteredShows.forEach((episode) => {
      dispatch(addToEpisodeFavorites(episode))
    })
    //setFavorites(query.trim() === '' ? [] : filteredShows);
    console.log(filteredShows);
  };

  const handleSort = (option: string) => {
    setSortOption(option);

    if (option !== '') {
      const sortedEpisodes = [...favoriteEpisode];
      sortedEpisodes.sort((a, b) => {
        if (option === 'a-z') {
          return a.title.localeCompare(b.title);
        } else if (option === 'z-a') {
          return b.title.localeCompare(a.title);
        } else if (option === 'most recent') {
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        } else if (option === 'least recent') {
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        }
        return 0;
      });
      // Dispatch the action to update favorites in the store
      dispatch(clearEpisodeFavorites());
      sortedEpisodes.forEach((episode) => {
        dispatch(addToEpisodeFavorites(episode));
      });
    }
  };

  const findShowById = (showId: string) => {
  const foundShow = favoriteShow.find((show) => show.id === showId);
  console.log("Found Show Data:", foundShow);
  return foundShow;
  };


 
 
  // Function to handle play button click
  const handlePlayButtonClick = (episodeUrl: string) => {
    setCurrentEpisodeUrl(episodeUrl);
    setIsPlaying(true);
    console.log(currentEpisodeUrl)
  };

 
  // Function to handle mini audio close.
const handleMiniAudioClose = () => {
  setIsAudioPlaying(false);
};

const handleReset = () => {
  dispatch(clearEpisodeFavorites())
}

const saTimezone = 'Africa/Johannesburg';

return (
 <div>
      <div className="header__container">
        <div className="left__elements">
          <h1 className="podcast__name">Favorites</h1>
        </div>
        <div className="right__elements">
          <button onClick={backToHome} className="favorites__button">
            Back
          </button>
          <button onClick={handleReset} className="favorites__reset">
            Reset
          </button>
        </div>
      </div>
      <FilterBar onSearch={handleSearch} onSort={handleSort} />
      <div className="favorites__container">
      {favoriteEpisode.map((episode) => {

            return (
              <button key={episode.title} className={`favorites__information ${favoriteShow.length === 1 ? 'favorites__information-large' : ''}`}
              onClick={() => setIsAudioPlaying(true)}
              >
                <div>
                 <h3>{episode.title}</h3>
                 <p>{episode.description}</p>
                 <p>Added At:  {new Date(episode.addedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}  {new Date(episode.addedAt).toLocaleTimeString('en-US',{timeStyle: "short"})}</p>
               </div>
              </button>
            );
          }

        )}
  
       
         {isAudioPlaying &&(
        <div className="favoritesmini__audiocontainer">
        <div className="favoritesmini__audio">
          <AudioPlayer
              ref={audioRef}
              autoPlay
              className="favoritesmini__audioplayer"
              src={currentEpisodeUrl}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          <button 
          onClick={handleMiniAudioClose}
          className="mini__cancel"
           ><CloseIcon /></button>
        </div>
       </div>
      )}
      </div>
    
      <Footer />
  </div>
  );
};

