import React, { useState, useEffect, useRef} from 'react';
import { FilterBar } from './Filter-bar';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import  {CircularProgress, Tooltip } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addToShowFavorites, clearShowFavorites, removeFromShowFavorites } from '../store/favoriteShowSlice';
import CloseIcon from '@mui/icons-material/Close';
import { allGenres } from '../data';
import { supabase } from '../Client';
import { setUsersData } from '../store/userDataSlice';
import { Footer } from './Footer';
import { Carousal } from './Carousal';



type AllShowData = Array<ShowPreview>;
type ShowOriginalData = Array<Show>
type FavoriteShowData = Array<FavoriteShow>;



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
  id: string,
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
};

type userInfo = {
  name: string;
  id: string;
  favorites: FavoriteShowData;
};

type PodcastPreviewProps = {
  data: ShowOriginalData;
  setUserInfo : React.Dispatch<React.SetStateAction<{
    name: string;
    id: string;
    favorites: any[];
}>>
   userInfo: userInfo;
};


export const PodcastPreview: React.FC<PodcastPreviewProps> = ({data,setUserInfo,userInfo}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatedShowData, setUpdatedShowData] = useState<AllShowData> ([]) // The complete data that has the seasons and episodes information.
  const [dialogOpen, setDialogOpen] = useState<boolean> (false); 
  const [selectedShow, setSelectedShow] = useState<ShowPreview | FavoriteShow> ()   // State that stores a specific shows data to be displayed on the dialog when a that show is selected.
  const [selectedSeasons, setSelectedSeasons] = useState <Seasons> ()   // Stores the seasons of the selected show.
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState< number | undefined> (0);//Index used to keep track of the active shows information.
  const [currentEpisodeUrl, setCurrentEpisodeUrl] = useState<string | null>(null); //State that keeps track of what audio to play.
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [filteredShows, setFilteredShows] = useState<AllShowData>([]);
  const [sortOption, setSortOption] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>({});
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState<boolean>(false)
  const [genreOption, setGenreOption] = useState<string>('')
  const [newId, setNewId] = useState<string>('')
  const [currentFavs,setCurrentFavs] = useState([])
 

  const favoriteShowArray = useSelector((state: RootState) => state.favoriteShow);
  const ids= useSelector((state: RootState) => state.id.id);
  const user = useSelector((state: RootState) => state.userData)
  const dispatch = useDispatch<AppDispatch>();
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
    // Load user data from local storage when the component mounts
    const storageUserInfo = localStorage.getItem('user');
    if (storageUserInfo) {
        const info = JSON.parse(storageUserInfo);
        dispatch(setUsersData(info));
        console.log(info)
    }
}, [dispatch]);
  
   
useEffect(() => {
  const fetchUserData = async () => {
    try {
      if (user.id !== '') {

      const { data, error } = await supabase
        .from('users')
        .select('favorites')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error.message);
        return;
      }

      // Check if favorites data is available
      if (data) {
       setCurrentFavs([])
       setCurrentFavs(data.favorites)
      }
    }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  fetchUserData();
}, [user.id, dispatch]); // Depend on user and dispatch
  

  const addToFavorites = async (showId: string) => {
   if (!user || !selectedShow) return;
  
    const isFavoriteInLocalState = favoriteShowArray.some((favShow) => favShow.id === showId);
    const isInDataBase = user.favorites.some((favShow) => favShow.id === showId)
    const newArray = [...favoriteShowArray, selectedShow]
    
    if (!isFavoriteInLocalState) {
      dispatch(addToShowFavorites(selectedShow))
   }
   if(!isInDataBase){
    try{  
      const {data,error} = await supabase
     .from('users')
     .update({favorites: newArray})
     .eq('id', user.id)

     if(error){
    console.error('Error updating favorites', error)
    }
  }catch(error){
    console.error('Error adding favorites',error)
  }
  }else{
  return
}
} 
  
/*const removeFromFavorites = async (showId: string) => {
      if (!user || !selectedShow) return
        
      const isFavoriteInLocalState = currentFavs.some((favShow) => favShow.id === showId);
      const isInDataBase = user.favorites.some((favShow) => favShow.id === showId)

      const newCurrentFavs =  currentFavs.filter((favShow) => favShow.id !== showId)
      setCurrentFavs(newCurrentFavs)
      if(isFavoriteInLocalState){
      dispatch(removeFromShowFavorites(showId))
      } 
      if(isInDataBase){
        
        try{
          const {data,error} = await supabase
          .from('users')
          .update({favorites: newCurrentFavs})
          .eq('id', user.id)
  
         if(error){
          console.error('Error updating favorites', error)
        }
   
        }catch(error){
          console.error('Error removing favorite', error)
        }
      }
  };
  */
     //This function finds the selected shows information through it's id.
  const findShowById = (showId: string): ShowPreview | undefined => {
    const foundShow = updatedShowData.find((show) => show.id === showId);
    
    if(foundShow){
      return foundShow
    } else {
      return undefined
    }
  };
  
  /*This function uses the findShowById function and displays the selected shows 
   *information.
   */
  const openDialog = (show: ShowPreview) => {
    const selectedShowData = findShowById(show.id);
    console.log(selectedShowData)
     const activeShowsSeasons = selectedShowData?.seasons // The seasons of the active show.
    
     if (activeShowsSeasons) {
    
      setSelectedShow(selectedShowData);
      setSelectedSeasons(activeShowsSeasons);
      setSelectedSeasonIndex(undefined); // Reset the selected season index when a new show is opened.
    }
   
    document.body.classList.add('modal-open');//This makes the browser focus only on the dialog that displays the season and episode information.
    setDialogOpen((prevDialogOpen) => !prevDialogOpen);
  };


   /*This function handles the closing of the dialog and also shows a prompt asking
   * if the user wants to continue listening to the selected audio if they close the dialog.
   */
  const closeDialog = () => {
    if(isPlaying){
    const shouldClose = window.confirm('Would you like to continue listening?');
    if (shouldClose) {
      // Play the audio if available
      setIsAudioPlaying(true);
      setDialogOpen(false)
      document.body.classList.remove('modal-open'); // Removes the CSS class to re-enable scrolling on body.
    } else {
      // If the user clicked "Cancel", pause the audio if available.
      setIsAudioPlaying(false)
      setDialogOpen(false)
      document.body.classList.remove('modal-open'); 
       }
  } 
  setDialogOpen(false)
  document.body.classList.remove('modal-open');
  };
 
  /*This function handles changing the episode url and saving it in the currentEpisodeUrl state 
   *so that selected episodes audio plays.
  */
  const handlePlayButtonClick = (episodeUrl: string) => {
    setCurrentEpisodeUrl(episodeUrl);
    setIsPlaying(true);
    setShowAudioSettings(true)
     // Reset audio progress and to start playing audio from the start.
     if (audioRef.current) {
      audioRef.current.audio.current.currentTime = 0;
      audioRef.current.audio.current.play();
    }
  };


  /*This function takes the number of the selected season and stores it in the 
   * selectedSeasonIndex state to keep track of what season information should be active.
   */
 const handleSeasonSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const seasonIndex = parseInt(event.target.value);
  setSelectedSeasonIndex(seasonIndex);
};

const handleSearch = (query: string) => {
  const filteredShows = updatedShowData.filter((show) =>
    show.title.toLowerCase().includes(query.toLowerCase())
  );
  
  setFilteredShows(query.trim() === '' ? [] : filteredShows);
};

const handleSort = (sortOption: string) => {
  setSortOption(sortOption);


  if (sortOption !== '') {
    const sortedShows = filteredShows.slice(); // Create a copy of the filtered shows to avoid directly modifying the state.
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


const handleGenreFilter = (genre: string) => {
  setGenreOption(genre);
  if (genre) {
    const filteredByGenre = updatedShowData.filter((show) =>
      show.genres?.includes(genre) // Use optional chaining here to avoid accessing undefined genres.
    );
    setFilteredShows(filteredByGenre);
  } else{
    setFilteredShows(updatedShowData);
  }
};

const checkIfStillFavorite = async (showId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('favorites')
      .eq('id', user.id)
      .single();

    if (error) {
      throw new Error('Error fetching user favorites');
    }

    if (data) {
      return data.favorites.some((show) => show.id === showId);
    }
  } catch (error) {
    console.error('Error occurred while checking if still favorite:', error);
    return false; // Return false in case of error
  }
};

const handleAddToFavorites = async () => {
   if (!selectedShow || !user) return;

  const isCurrentlyFavoriteLocally = favoriteShowArray.some((favShow) => favShow.id === selectedShow.id);

  if (!isCurrentlyFavoriteLocally) {
    addToFavorites(selectedShow.id);
    dispatch(setUsersData({id: user.id,name: user.name,favorites: favoriteShowArray}))
    } else {
   return
  }
};







const handleMiniAudioClose = () => {
  setIsAudioPlaying(false);
  setCurrentEpisodeUrl(null);
};


  return (
    <div>
      <div className='carousal'>
        <Carousal 
        data = {data}
        />
      </div>
      <FilterBar
       onSearch={handleSearch}
       filteredShows={filteredShows}
       onSort={handleSort}
       allGenres={allGenres}
       handleGenreFilter= {handleGenreFilter}
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
       
           <img className={`preview__img ${filteredShows.length === 1 ? 'preview__img-large' : ''}`}
           src={show.image} alt={show.title} />
       
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
       <div className='dialog__main'>
        <div className="dialog__container">
          <div className="blur__background" />
          <dialog className="dialog">
          <div className="selectedshow__mp3">
            <div>
            <img src={selectedShow.image} alt="Show image" className="blurred__background"></img>
            </div>
            <img src={selectedShow.image} alt="Show image" className="selectedshow__image"></img>
            <button className="favorite__button" onClick={() => handleAddToFavorites()}>
               {
                favoriteShowArray.some((favShow) => favShow.id === selectedShow.id)
              
               ? (
                <BookmarkIcon style={{ fill: 'red' }}/>
                ) : (
                <BookmarkBorderOutlinedIcon />
                )}
           </button>

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
                  <option value=""> Season</option>
                  {selectedShow.seasons.map((season, index) => ( // Render only the seasons of the selected show
                    <option key={index} value={index}>
                      {season.season}
                    </option>
                  ))}
                </select>

              </div>


                 {/*First seasons information will display when dialog opens.*/}
                 {(selectedSeasonIndex === undefined) && selectedShow && selectedShow.seasons.length > 0 && (
                 
                <div className="seasons__information">
                  
                  <div className="seasons__title">
                  <h3>Season: <span>{selectedShow.seasons[0].season}</span> | {selectedShow.seasons[0].title} </h3>
                  <h3>Episodes: {selectedShow.seasons[0].episodes.length}</h3>
                  </div>
                  <Tooltip title='Double click to play' arrow>
                  <ul className="seasons__episodes">
                    {selectedShow.seasons[0].episodes.map((episode: Episodes, index) => (
                   
                      <li key={index}  className="episodes">
                      
                        <div  
                        className="play__button"
                        onClick={() =>{ handlePlayButtonClick(episode.file)
                                             setIsPlaying(true)
                              }
                              }>
                            <p>
                              Episode {episode.episode}: 
                            </p>
                          
                         
                          <div>
                            <p>{episode.title}</p>
                            <p>Description: {episode.description}</p>
                         
                          </div>
                          
                          
                          </div>
                         
                      </li>
                   
                    ))}

                  </ul>
                  </Tooltip>
                  <button className="dialog__button" onClick={ closeDialog}>
                       Close
                     </button>
               
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
                        className="play__button"
                        onClick={() =>{ handlePlayButtonClick(episode.file)
                                            setIsPlaying(true)
                             }
                        }>
                           <p>
                             Episode {episode.episode}: 
                           </p>
                         
                        
                         <div>
                           <p>{episode.title}</p>
                           <p>Description: {episode.description}</p>
                        
                         </div>
                       
                      
                         </div>
                     </li>
                     
                    ))}
                  </ul>
                 
                </div>
               
              )}
               <button className="dialog__button" onClick={ closeDialog}>
                  Close
                </button>
                
            </div>
          
            
          </dialog>
        </div>
        </div>
      )}
       {isAudioPlaying && (
        <div className="mini__audiocontainer">
        <div className="mini__audio">
          <div className="mini__img">
          
          <img src={selectedShow.image}></img>
          </div>
          <div>
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
           >
            <Tooltip title='Close' arrow> 
            <CloseIcon />
            </Tooltip>
            </button>
           
          </div>
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
        <Footer />
    </div>

  )
}

