import React, {useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store/store';
import { FilterBar } from './FavoritesFilterBar';
import { Footer } from './Footer';
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
  const [currentEpisodeUrl, setCurrentEpisodeUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // This will be used to pause and play the audio.
  const [allFavoriteShows, setAllFavoriteShows] = useState<FavoriteShowData>([])
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState< number | undefined> (0);//Index used to keep track of the active shows episodes information.
  const [genreOption, setGenreOption] = useState<string>('');
 
  
  
  const [sortOption, setSortOption] = React.useState<string>('');
  const audioRef = useRef(null);

  const navigate = useNavigate();

  const backToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    const favoriteShowsFromLocalStorage = localStorage.getItem('favoriteShows');
    if (favoriteShowsFromLocalStorage) {
      const parsedFavorites: FavoriteShowData = JSON.parse(favoriteShowsFromLocalStorage);
      setAllFavoriteShows(parsedFavorites);
      dispatch(clearShowFavorites());
      parsedFavorites.forEach((show) => {
        dispatch(addToShowFavorites(show));
      });
    }
  }, []);

  
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

  const handleSeasonSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const seasonIndex = parseInt(event.target.value);
    setSelectedSeasonIndex(seasonIndex);
  };
  
 
 
  
  const handlePlayButtonClick = (episodeUrl: string) => {
    setCurrentEpisodeUrl(episodeUrl);
    setIsPlaying(true);
    console.log(currentEpisodeUrl)

     // Reset audio progress and start playing the audio from the beginning.
     if (audioRef.current) {
      audioRef.current.audio.current.currentTime = 0; 
      audioRef.current.audio.current.play(); 
    }
  };
 
  const shows = favoriteShow
 
 
const handleMiniAudioClose = () => {
  setIsAudioPlaying(false);
  setCurrentEpisodeUrl(null)
};


const findShowById = (showId: string) => {
  const foundShow = favoriteShow.find((show) => show.id === showId);
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
    if(isPlaying){
    const shouldClose = window.confirm('Would you like to continue listening?');
    if (shouldClose) {
      // Play the audio if available
      setIsAudioPlaying(true);
      setDialogOpen(false)
      document.body.classList.remove('modal-open'); // Removes the CSS class to re-enable scrolling on body.
      setCurrentEpisodeUrl(selectedSeasons[selectedSeasonIndex].episodes[selectedEpisodeIndex].file)
    } else {
      // If the user clicked "Cancel", pause the audio if available
      setIsAudioPlaying(false)
      setDialogOpen(false)
      document.body.classList.remove('modal-open'); 
      
    }
  } 
  setDialogOpen(false)
  document.body.classList.remove('modal-open'); 
  setCurrentEpisodeUrl(null)
  };

  const allGenres = [  "True Crime and Investigative Journalism",  "Comedy",  "News",  "Business",  "Technology",  "Education",  "History",  "Health",  "Science",  "Politics",  "Sports",  "Entertainment",  "Music",  "Food",  "Travel",  "Storytelling",  "Interviews",  "Fiction",  "Self-Improvement",  "Spirituality",  "Documentary",  "Parenting",  "Gaming",  "Art",  "Society & Culture",  "Hobbies",  "Fitness",  "Fashion",  "Personal  Growth",  "Philosophy",  "Relationships",  "Languages",  "Technology",  "Books",  "Psychology",  "True Stories",  "Horror",  "Design",  "Film",  "Environment",  "Marketing",  "Motivation",  "Investing",  "Astrology",  "Career",  "Home Improvement",  "Mental Health",  "Nature",  "Photography",  "Poetry",  "Science Fiction",  "Sustainability",  "Theater",  "Travel",  "Videogames",  "Wellness",  "Writing", "Featured"]



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
    console.log('yay');
  } else {
    dispatch(clearShowFavorites()); // Clear existing favorites.
    favoriteShow.forEach((show) => {
      dispatch(addToShowFavorites(show)); // Dispatch all shows.
    });
    console.log('nay');
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
      {favoriteShow.map((show) => {
              
            return (
              <button key={show.title} className={`preview__information ${favoriteShow.length === 1 ? 'preview__information-large' : ''} ${favoriteShow.length === 2 ? 'preview__information-medium' : ''}`}
               onClick={() => openDialog(show)}
              >
                   <div>
           <img className={`preview__img ${favoriteShow.length === 1 ? 'preview__img-large' : ''}`}
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
                       
                       onClick={() =>{ handlePlayButtonClick(episode.file)
                                            setIsPlaying(true)
                                            setIsAudioPlaying(true)
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

