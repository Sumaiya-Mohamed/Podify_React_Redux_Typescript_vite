import React, { useState, useEffect, useRef} from 'react';
import { FilterBar } from './Filter-bar';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import  {CircularProgress } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addToEpisodeFavorites, removeFromEpisodeFavorites} from '../store/favoriteEpisodesSlice';
import { addToShowFavorites, removeFromShowFavorites } from '../store/favoriteShowSlice';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ReactPlayer from 'react-player';


type AllShowData = Array<ShowPreview>;
type ShowOriginalData = Array<Show>
type FavoriteShowData = Array<FavoriteShow>;
type FavoriteEpisodeData = Array<Episodes>;


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


type PodcastPreviewProps = {
  data: ShowOriginalData
  showIds: Array<string>
};

type Seasons = Array<Season>

type Season = {
  season: number,
  title: string,
  image: string,
  episodes: Array<Episodes>,
}

type Episodes = {
  title: string,
  description: string,
  episode: number,
  file: string,
  addedAt: string; 
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



export const PodcastPreview: React.FC<PodcastPreviewProps> = ({data, showIds}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatedShowData, setUpdatedShowData] = useState<AllShowData> ([]) // The complete data that has the seasons and episodes information.
  const [dialogOpen, setDialogOpen] = useState<boolean> (false);   // A boolean value to toggle the dialog between open and close.
  const [selectedShow, setSelectedShow] = useState<ShowPreview | FavoriteShow> ()   // State that stores a specific shows data to be displayed on the dialog when a that show is selected.
  const [selectedSeasons, setSelectedSeasons] = useState <Seasons> ()   // Stores the seasons of the selected show.
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState< number | undefined> (0);//Index used to keep track of the active shows information.
  const [currentEpisodeUrl, setCurrentEpisodeUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // This will be used to pause and play the audio.
  const [filteredShows, setFilteredShows] = useState<AllShowData>([]);
  const [sortOption, setSortOption] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>({});
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [episode,setEpisode] = useState<Episodes>()
  const [showAudioSettings, setShowAudioSettings] = useState<boolean>(false)

  const favoriteEpisode = useSelector((state: RootState) => state.favoriteEpisode);
  const favoriteShow = useSelector((state: RootState) => state.favoriteShow);
  const dispatch = useDispatch<AppDispatch>(); //This will be used to update the favorites state array.
  const audioRef = useRef(null);

  useEffect(() => {

    const showData = async (): Promise<void> => {
      try {
       
        const requests = data.map(async (show) => {
          const id = show.id;
          setIsLoading(true);
          const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
          if (!response.ok) {
            throw new Error('Request Failed');
          }
          return response.json();
        });
  
        const mergedShowData = await Promise.all(requests);
        setUpdatedShowData(mergedShowData);
        setFilteredShows(mergedShowData);
      } catch (error) {
        console.log('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
        
    void showData();
  }, [ data]);

  useEffect(() => {
    // Initialize favoriteMap based on favorites
    const newFavoriteMap: Record<string, boolean> = {};
    favoriteEpisode.forEach((favShow) => {
      newFavoriteMap[favShow.title] = true;
    });
    setFavoriteMap(newFavoriteMap);
  }, [favoriteEpisode]);
  
  const findShowById = (showId: string) => {
  const foundShow = updatedShowData.find((show) => show.id === showId);
  return foundShow;
  };

  const openDialog = (show: ShowPreview) => {
    const selectedShowData = findShowById(show.id);
     const activeShowsSeasons = selectedShowData?.seasons // The seasons of the active show.
    
     if (activeShowsSeasons) {
    
      setSelectedShow(selectedShowData);
      setSelectedSeasons(activeShowsSeasons);
      setSelectedSeasonIndex(undefined); // Reset the selected season index when a new show is opened.
    }
   
    document.body.classList.add('modal-open');
    setDialogOpen((prevDialogOpen) => !prevDialogOpen);
  };


  const closeDialog = () => {
    const shouldClose = window.confirm('Would you like to continue listening?');

    if (shouldClose) {
      // Play the audio if available
      setIsAudioPlaying(true);
      console.log(isAudioPlaying)
      setDialogOpen(false)
      document.body.classList.remove('modal-open'); // Removes the CSS class to re-enable scrolling on body.
    } else {
      // If the user clicked "Cancel", pause the audio if available
      setIsAudioPlaying(false)
      setDialogOpen(false)
      document.body.classList.remove('modal-open'); 
    }
    setShowAudioSettings(false)
  };

 
  // Function to handle play button click
  const handlePlayButtonClick = (episodeUrl: string) => {
    setCurrentEpisodeUrl(episodeUrl);
    setIsPlaying(true);
    setShowAudioSettings(true)
  };

 // Add a new function to handle the season selection from the dropdown
 const handleSeasonSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const seasonIndex = parseInt(event.target.value);
  setSelectedSeasonIndex(seasonIndex);
};

const handleSearch = (query: string) => {
  const filteredShows = updatedShowData.filter((show) =>
    show.title.toLowerCase().includes(query.toLowerCase())
  );
  // If the search query is empty, reset filteredShows to an empty array
  setFilteredShows(query.trim() === '' ? [] : filteredShows);
  console.log(filteredShows);
};

const handleSort = (sortOption: string) => {
  setSortOption(sortOption);


  if (sortOption !== '') {
    const sortedShows = filteredShows.slice(); // Create a copy of the filtered shows to avoid directly modifying the state
    sortedShows.sort((a, b) => {
      if (sortOption === 'a-z') {
        return a.title.localeCompare(b.title);
      } else if (sortOption === 'z-a') {
        return b.title.localeCompare(a.title);
      } else if (sortOption === 'most recent') {
        return new Date(b.updated).getTime() - new Date(a.updated).getTime();
      } else if (sortOption === 'least recent') {
        return new Date(a.updated).getTime() - new Date(b.updated).getTime();
      }
      return 0;
    });
    setFilteredShows(sortedShows);
  }
};


const handleAddToFavorites = (episode: Episodes) => {
  const episodeId = episode.title; // Assuming episode titles are unique identifiers

  // Check if the episode is already a favorite
  const isEpisodeFavorite = favoriteEpisode.some((favEpisode) => favEpisode.title === episode.title);

  if (!isEpisodeFavorite) {
    // If the episode is not a favorite, add it to the favoriteEpisode array
    const addedAt = new Date().toLocaleDateString('en-US', { dateStyle: 'long' });
    const newFavoriteEpisode: Episodes = { ...episode, addedAt };
    dispatch(addToEpisodeFavorites(newFavoriteEpisode));

    // Find the selected show in the favoriteShow array
    const existingShow = favoriteShow.find((show) => show.id === selectedShow.id);

    if (existingShow) {
      // If the show already exists, update its favoriteEpisodeData array.
      const updatedShow = {
        ...existingShow,
        favoriteEpisodeData: [...existingShow.favoriteEpisodeData, newFavoriteEpisode],
      };
      dispatch(addToShowFavorites(updatedShow));
    } else {
      // If the show does not exist, create a new entry
      const newShow: FavoriteShow = {
        ...selectedShow,
        favoriteEpisodeData: [newFavoriteEpisode],
      };
      dispatch(addToShowFavorites(newShow));
    }
  } else {
    // If the episode is already a favorite, remove it from the favoriteEpisode array
    dispatch(removeFromEpisodeFavorites(episodeId));

    // Find the selected show in the favoriteShow array
    const existingShow = favoriteShow.find((show) => show.id === selectedShow.id);

    if (existingShow) {
      // If the show exists, remove the episode from its favoriteEpisodeData array
      const updatedEpisodes = existingShow.favoriteEpisodeData.filter((ep) => ep.title !== episode.title);
      const updatedShow = { ...existingShow, favoriteEpisodeData: updatedEpisodes };
      dispatch(addToShowFavorites(updatedShow));
    }
  }
};


// Function to handle mini audio close.
const handleMiniAudioClose = () => {
  setIsAudioPlaying(false);
};


  return (
    <div>
      <FilterBar
       onSearch={handleSearch}
       filteredShows={filteredShows}
       onSort={handleSort} // Pass the handleSort function as a prop to FilterBar
      />
    
     {isLoading ? (
        <div className="loading__container">
         <CircularProgress size={40} color="inherit" className="loading"/> 
        </div>
        ) : ( 
        <div>
       <div className="preview__container">
       {filteredShows.map((show) => (
        <div key={show.id}>
          <button className={`preview__information ${filteredShows.length === 1 ? 'preview__information-large' : ''}`}
            onClick={() => openDialog(show)}>
            <div>
           <img className={`preview__img ${filteredShows.length === 1 ? 'preview__img-large' : ''}`}
           src={show.image} alt={show.title} />
           </div>
           <div className="preview__content">
             <h3 className="preview__title">{show.title}</h3>
             <h3> Seasons:{show.seasons.length}</h3>
             <div className="genres-container">
               <p className="show__genre"> 
                 <span className="genre__title">Genres: </span>
                 {show.genres && show.genres.length > 0 ? show.genres.join(', ') : 'Not applicable'}
               </p>
             </div>
             <p>Updated:  {new Date(show.updated).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
           </div>
          
         </button>
        
        </div>
      ))}
     
       
       {dialogOpen && selectedShow && selectedSeasons && (
        <div className="dialog__container">
          <div className="blur__background" />
          <dialog className="dialog">
          <div className="selectedshow__mp3">
            <div>
            <img src={selectedShow.image} alt="Show image" className="blurred__background"></img>
            </div>
            <img src={selectedShow.image} alt="Show image" className="selectedshow__image"></img>
          
              {currentEpisodeUrl && showAudioSettings &&(
          <div>
            <AudioPlayer
              ref={audioRef}
              className="audio__player"
              src={currentEpisodeUrl}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
         )}
            </div>
            <div >
            <div className="selectedshow__content">
              <p>
                <span className="content__headings">Title:</span>{" "}
                {selectedShow.title}
              </p>
              <p>
                <span className="content__headings">Seasons:</span>{" "}
                {selectedShow.seasons.length}
              </p>
              <p>
                <span className="content__headings">Updated: </span>{" "}
                {new Date(selectedShow.updated).toLocaleDateString("en-US", {
                  dateStyle: "long",
                })}
              </p>
              <p>
                <span className="content__headings">Description: </span>
                {selectedShow.description}
              </p>
            </div>
              <div className="select__container">
                <select value={selectedSeasonIndex ?? ''} onChange={handleSeasonSelect} className="seasons__select">
                  <option value=""> Select a season</option>
                  {selectedShow.seasons.map((season, index) => ( // Render only the seasons of the selected show
                    <option key={index} value={index}>
                      {season.season}
                    </option>
                  ))}
                </select>

              </div>


                 {/* Using conditional rendering to display the first season information */}
                 {(selectedSeasonIndex === undefined) && selectedShow && selectedShow.seasons.length > 0 && (
                <div className="seasons__information">
                  <div className="seasons__title">
                  <h3>Season: <span>{selectedShow.seasons[0].season}</span> | {selectedShow.seasons[0].title} </h3>
                  <h3>Episodes: {selectedShow.seasons[0].episodes.length}</h3>
                  </div>
                  <ul className="seasons__episodes">
                    {selectedShow.seasons[0].episodes.map((episode: Episodes, index) => (
                  
                      <li key={index}  className="episodes">
                       
                        <div  
                        className="play__button"
                        onClick={() =>{ handlePlayButtonClick(episode.file)
                                             setIsPlaying(true)
                              }
                              }>
                            <p className="episode__number">
                              Episode {episode.episode}: 
                            </p>
                          
                         
                          <div className="episode__details">
                            <p>{episode.title}</p>
                            <p className="episode__description">Description: {episode.description}</p>
                         
                          </div>
                          
                          <button className="favorite__button" onClick={() => handleAddToFavorites(episode)}>
                            {favoriteMap[episode.title] ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
                          </button>
                          </div>
                      </li>
                     
                    ))}
                  </ul>
              
                </div>
              )}
            
              {/* Render episodes of the selected season */}
              {(selectedSeasonIndex !== null || selectedSeasonIndex !== undefined) && selectedShow.seasons[selectedSeasonIndex as number]?.episodes && (
                <div className="seasons__information">
                  <div className="seasons__title">
                  <h3>Season: {selectedShow.seasons[selectedSeasonIndex as number].season} | <span>{selectedShow.seasons[selectedSeasonIndex as number].title}</span></h3>
                  <h3>Episodes: {selectedShow.seasons[selectedSeasonIndex as number].episodes.length}</h3>
                  </div>
                  
                  <ul className="seasons__episodes">
                    {selectedShow.seasons[selectedSeasonIndex as number].episodes.map((episode, index) => (
                       <li key={index}  className="episodes">
                       
                       <div  
                       
                       onClick={() =>{ handlePlayButtonClick(episode.file)
                                            setIsPlaying(true)
                             }
                             }>
                           <p className="episode__number">
                             Episode {episode.episode}: 
                           </p>
                         
                        
                         <div className="episode__details">
                           <p>{episode.title}</p>
                           <p className="episode__description">Description: {episode.description}</p>
                        
                         </div>
                         
                         <button className="favorite__button" onClick={() => handleAddToFavorites(episode)}>
                           {favoriteMap[episode.title] ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
                         </button>
                         </div>
                     </li>
                    
                   
                    ))}
                  </ul>
                 
                </div>
              )}
            </div>
          
            <button className="dialog__button" onClick={closeDialog}>
              Close
            </button>
          </dialog>
        </div>
      )}
      {isAudioPlaying && (
        <div className="mini__audiocontainer">
        <div className="mini__audio">
          <img src={selectedShow.image}></img>
          <AudioPlayer
              ref={audioRef}
              autoPlay
              className="mini__audioplayer"
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
     <div className="backbutton__container">
      <button 
      className="back__button"
      onClick={() => setFilteredShows(updatedShowData)}
      >Back</button>
      </div>
      </div>
       )
     }
        
    </div>

  )
}

