import React, {useState, useRef, useEffect} from 'react';
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
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState< number | undefined> (0);
  const [renderedShows, setRenderedShows] = useState([]);
  const [genreOption, setGenreOption] = useState<string>('')
 
  
  
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
      // Step 3: Dispatch the favorites to the Redux store
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

    // If the search query is empty, reset filteredShows to an empty array
    dispatch(clearShowFavorites());
    filteredShows.forEach((show) => {
      dispatch(addToShowFavorites(show))
    })
    //setFavorites(query.trim() === '' ? [] : filteredShows);
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

const findShowById = (showId: string) => {
  const foundShow = favoriteShow.find((show) => show.id === showId);
  return foundShow;
  };


/*const openDialog = (show: ShowPreview) => {
  const selectedShowData = findShowById(show.id);
   const activeShowsSeasons = selectedShowData?.favoriteEpisodeData // The seasons of the active show.
  
   if (activeShowsSeasons) {
  
    setSelectedShow(selectedShowData);
    setSavedEpisodes(activeShowsSeasons);
    setSelectedEpisodeIndex(undefined); // Reset the selected season index when a new show is opened.
  }
 
  document.body.classList.add('modal-open');
  setDialogOpen((prevDialogOpen) => !prevDialogOpen);
};*/

const closeDialog = () => {
    setDialogOpen(false)
    document.body.classList.remove('modal-open'); 


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
               if (renderedShows.includes(show.title)) {
                return null; // Skip rendering this show
              }
            return (
              <button key={show.title} className={`preview__information ${favoriteShow.length === 1 ? 'preview__information-large' : ''} ${favoriteShow.length === 2 ? 'preview__information-medium' : ''}`}>
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
  
       {dialogOpen && selectedShow && savedEpisodes && (
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
            <ul className="seasons__episodes">
                    {selectedShow.favoriteEpisodeData.map((episode: Episodes, index) => (
                  
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
                          </div>
                      </li>
                     
                    ))}
                  </ul>
                  <button className="dialog__button" onClick={closeDialog}>
                   Close
                  </button>
            </dialog>
             </div>
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

