
import React, { useState, useEffect} from 'react';
import { FilterBar } from './Filter-bar';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Button, CircularProgress } from '@mui/material';

type AllShowData = Array<ShowPreview>;
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


type ActiveShowData = {
  id: string;
  image: string;
  description: string;
  genres: Array<string>
  seasons: Seasons
}

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
};


export const PodcastPreview: React.FC<PodcastPreviewProps> = ({data, showIds}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatedShowData, setUpdatedShowData] = useState<AllShowData> ([]) // The complete data that has the seasons and episodes information.
  const [dialogOpen, setDialogOpen] = useState<boolean> (false);   // A boolean value to toggle the dialog between open and close.
  const [selectedShow, setSelectedShow] = useState<ShowPreview> ()   // State that stores a specific shows data to be displayed on the dialog when a that show is selected.
  const [selectedSeasons, setSelectedSeasons] = useState <Seasons> ()   // Stores the seasons of the selected show.
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState< number | undefined> (0);//Index used to keep track of the active shows information.
  const [currentEpisodeUrl, setCurrentEpisodeUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // This will be used to pause and play the audio.
  const [filteredShows, setFilteredShows] = useState<AllShowData>([]);
  const [sortOption, setSortOption] = useState<string>('');

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

 
  const findShowById = (showId: string) => {
    const foundShow = updatedShowData.find((show) => show.id === showId);
    console.log(updatedShowData)
  console.log("Found Show Data:", foundShow);
  return foundShow;
  };

  const openDialog = (show: ShowPreview) => {
    const selectedShowData = findShowById(show.id);
    console.log("Selected Show Data:", selectedShowData);
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
    setDialogOpen(false);
    document.body.classList.remove('modal-open'); // Removes the CSS class to re-enable scrolling on body.
  };

 
  // Function to handle play button click
  const handlePlayButtonClick = (episodeUrl: string) => {
    setCurrentEpisodeUrl(episodeUrl);
    setIsPlaying(true);
    console.log(currentEpisodeUrl)
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
            {currentEpisodeUrl &&  (
                 <div>
                 <AudioPlayer
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
                    {selectedShow.seasons[0].episodes.map((episode, index) => (
                  
                      <li key={index}  className="episodes">
                       
                        
                            <p className="episode__number">
                              Episode {episode.episode}: 
                            </p>
                          
                         
                          <div className="episode__details">
                            <p>{episode.title}</p>
                            <p className="episode__description">Description: {episode.description}</p>
                         
                          </div>
                          <div className="play__button">
                            <img src="./src/assets/play-button.png"
                              alt="Play Button"
                              onClick={() => handlePlayButtonClick(episode.file)}
                            >
                            </img>
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
                        
                          <div className="episode__number">
                           <p>
                            Episode {episode.episode}
                           </p>
                          </div>
                          <div className="episode__details">
                           <p>{episode.title}</p>
                           <p>Description: {episode.description}</p>
                          </div>
                          <div className="play__button">
                           <img src="./src/assets/play-button.png"
                             alt="Play Button"
                             onClick={() => handlePlayButtonClick(episode.file)}
                            >
                           </img>
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