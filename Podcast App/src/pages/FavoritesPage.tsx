import React, {useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store/store';
import { FilterBar } from '../components/FavoritesFilterBar';
import { Footer } from '../components/Footer';
import { addToShowFavorites, removeFromShowFavorites, clearShowFavorites } from '../store/favoriteShowSlice';
import AudioPlayer from 'react-h5-audio-player';
import CloseIcon from '@mui/icons-material/Close';
import { allGenres } from '../data';
import { supabase } from '../Client';


type FavoriteShowData = Array<FavoriteShow>;


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
  const favoriteShow = useSelector((state:RootState) => state.favoriteShow)
  const dispatch = useAppDispatch(); 
  const [dialogOpen, setDialogOpen] = useState<boolean> (false); 
  const [selectedShow, setSelectedShow] = useState<FavoriteShow> ()   // State that stores a specific shows data to be displayed on the dialog when a that show is selected.
  const [selectedSeasons, setSelectedSeasons] = useState <Seasons> ()   // Stores the seasons of the selected show.
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState< number | undefined> (0);//Index used to keep track of the active shows season information.
  const [currentEpisodeUrl, setCurrentEpisodeUrl] = useState<string | null>(null); //Episode url used to fetch the audio file.
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // This will be used to pause and play the audio.
  const [allFavoriteShows, setAllFavoriteShows] = useState<FavoriteShowData>([])
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState< number | undefined> (0);//Index used to keep track of the active shows episodes information.
  const [genreOption, setGenreOption] = useState<string>('');
 
  
  
  const [sortOption, setSortOption] = React.useState<string>('');
  const audioRef = useRef(null);

  const id = useSelector((state: RootState) => state.id)
  const userData = useSelector((state: RootState) => state.userData)
  const navigate = useNavigate();

  //This function takes the user back to the home page.
  const backToHome = () => {
    navigate('/components/Homepage');
  };

  /*useEffect(() => {
    //Using local storage to store the favorite shows.
    const favoriteShowsFromLocalStorage = localStorage.getItem('favoriteShows');
    if (favoriteShowsFromLocalStorage) {
      const parsedFavorites: FavoriteShowData = JSON.parse(favoriteShowsFromLocalStorage);
      setAllFavoriteShows(parsedFavorites);
      dispatch(clearShowFavorites());
      parsedFavorites.forEach((show) => {
        dispatch(addToShowFavorites(show));
      });
    }
  }, []);*/

  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('favorites')
          .eq('id', userData.id);

        console.log(data);
        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          // Update the local state with user's favorite shows
          const userFavorites: FavoriteShowData = data[0].favorites
         
          setAllFavoriteShows(userFavorites);
          
          // Dispatch the action to update favorites in the store
          dispatch(clearShowFavorites());
          userFavorites.forEach((show) => {
            dispatch(addToShowFavorites(show));
          });
          console.log(favoriteShow)
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userData.id, dispatch]);
  

  
  const handleSearch = (query: string) => {
    const filteredShows = favoriteShow.filter((show) =>
      show.title.toLowerCase().includes(query.toLowerCase())
    );

    dispatch(clearShowFavorites());
    filteredShows.forEach((show) => {
      dispatch(addToShowFavorites(show))
    })
   
  };

  const handleSort = (option: string) => {
    setSortOption(option);

    if (option !== '') {
      const sortedShows = [...favoriteShow];
      sortedShows.sort((a, b) => {
        if (option === 'a-z') {
          return a.title.localeCompare(b.title);
        } else if (option === 'z-a') {
          return b.title.localeCompare(a.title);
        } else if (option === 'most recent') {
          return new Date(b.updated).getTime() - new Date(a.updated).getTime();
        } else if (option === 'least recent') {
          return new Date(a.updated).getTime() - new Date(b.updated).getTime();
        }
        return 0;
      });
      // Dispatch the action to update favorites in the store
      dispatch(clearShowFavorites());
      sortedShows.forEach((show) => {
        dispatch(addToShowFavorites(show));
      });
    }
  };

   /*This function takes the number of the selected season and stores it in the 
    * selectedSeasonIndex state to keep track of what season information should be active.
   */
  const handleSeasonSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const seasonIndex = parseInt(event.target.value);
    setSelectedSeasonIndex(seasonIndex);
  };
  
  /*This function handles changing the episode url and saving it in the currentEpisodeUrl state 
   *so that selected episodes audio plays.
  */
  const handlePlayButtonClick = (episodeUrl: string) => {
    setCurrentEpisodeUrl(null)
    setCurrentEpisodeUrl(episodeUrl);
    setIsPlaying(true);

     // Reset audio progress and start playing the audio from the beginning.
     if (audioRef.current) {
      audioRef.current.audio.current.currentTime = 0; 
      audioRef.current.audio.current.play(); 
    }
  };
 
 
const handleMiniAudioClose = () => {
  setIsAudioPlaying(false);
  setCurrentEpisodeUrl(null)
};

//This function finds the selected shows information through it's id.
const findShowById = (showId: string) => {
  const foundShow = favoriteShow.find((show) => show.id === showId);
  return foundShow;
  };

/*This function uses the findShowById function and displays the selected shows 
 *information.
 */
  const openDialog = (show: ShowPreview) => {
    const selectedShowData = findShowById(show.id);
     const activeShowsSeasons = selectedShowData?.seasons // The seasons of the active show.
    
     if (activeShowsSeasons) {
    
      setSelectedShow(selectedShowData);
      setSelectedSeasons(activeShowsSeasons);
      setSelectedSeasonIndex(undefined); // Reset the selected season index when a new show is opened.
    }

    if (audioRef.current) {
      audioRef.current.audio.current.currentTime = 0;
    }
   
    document.body.classList.add('modal-open'); //This makes the browser focus only on the dialog that displays the season and episode information.
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
 


/*This function handles sorting the originally listed shows to the selected option
 * and storing the filtered shows in the favoriteShow state.
 */
const handleGenreFilter = (genre: string) => {
  setGenreOption(genre);
  
  if (genre) {
    const filteredByGenre = favoriteShow.filter((show) =>
      show.genres?.includes(genre)
    );
    dispatch(clearShowFavorites()); // Clear existing favorites first.
    filteredByGenre.forEach((show) => {
      dispatch(addToShowFavorites(show)); // Dispatch filtered shows.
    });
  } else {
    dispatch(clearShowFavorites()); // Clear existing favorites.
    favoriteShow.forEach((show) => {
      dispatch(addToShowFavorites(show)); // Dispatch all shows.
    });
  }
};

const clearFavorites = () => {
  dispatch(clearShowFavorites());
  localStorage.removeItem('favoriteShows');
};

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
          <button onClick={clearFavorites} className="favorites__reset">
            Reset
          </button>
        </div>
      </div>
      <FilterBar 
      onSearch={handleSearch} 
      onSort={handleSort} 
      allGenres={allGenres}
      handleGenreFilter= {handleGenreFilter}
      />
      <div className="preview__container">
      {favoriteShow.map((show,index) => {
              
            return (
              <button key={index} className={`preview__information ${favoriteShow.length === 1 ? 'preview__information-large' : ''} ${favoriteShow.length === 2 ? 'preview__information-medium' : ''}`}
               onClick={() => openDialog(show)}
              >
            <div key={show.id}>
           <img className={`preview__img ${favoriteShow.length === 1 ? 'preview__img-large' : ''}`}
           src= {show.image} alt={show.title} />
           </div>
           <div className="preview__content">
             <h3 className="preview__title">{show.title}</h3>
             <h3>Seasons: {show.seasons.length}</h3>
             <div className="genres-container">
               <p className="show__genre"> 
                 <span className="genre__title">Genres: </span>
                 {show.genres && show.genres.length > 0 ? show.genres.join(', ') : 'Not applicable'}
               </p>
             </div>
             <p>Updated:  {new Date(show.updated).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
           </div>
          
              </button>
            );
          }

        )}
  
       {dialogOpen && selectedShow && (
        <div className="dialog__container">
          <div className="blur__background" />
          <dialog className="dialog">
          <div className="selectedshow__mp3">
            <div>
            <img src={selectedShow.image} alt="Show image" className="blurred__background"></img>
            </div>
            <img src={selectedShow.image} alt="Show image" className="selectedshow__image"></img>
          
              {currentEpisodeUrl && (
          <div>
            <AudioPlayer
              ref={audioRef}
              className="audio__player"
              autoPlay
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
                 
                   {/*First seasons information will display when dialog opens.*/}
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
      onClick={() =>  window.location.reload()}
      >Back</button>
      </div>

      <Footer />
  </div>
  );
};

