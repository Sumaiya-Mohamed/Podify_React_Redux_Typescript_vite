
import React, { useState, useEffect, useRef} from 'react';

type ShowPreview = Array<Show>

type Show = {
  id: string;
  title: string;
  description: string;
  image: string;
  seasons: Array<Seasons> | number ;
  genres: Array<number>;
  updated: Date;
};

type PodcastPreviewProps = {
  data: ShowPreview
  showIds: Array<string>
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


export const PodcastPreview: React.FC<PodcastPreviewProps> = ({data, showIds}) => {
  const [updatedShowData, setUpdatedShowData] = useState<ShowPreview | []>([])
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null)
 

  useEffect(() => {
      const controller = new AbortController(); // Create a new AbortController instance
      const signal = controller.signal; // Get the signal property from the controller   

       const showData = async (): Promise<void> => {
        try{
          const mergedShowData = [] //This is the array that all the individual show data will be put into because the api returns many objects(the different show data).
          for (const show of data){
            const id = show.id
            const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
            if(!response.ok){
              throw new Error('Request Failed');
            }
            const shows = await response.json() as Show;
            mergedShowData.push(shows)
            setUpdatedShowData(mergedShowData);
          }
        } catch(error){
          console.log('Error:', error);
        }
       }
       void showData();

       return() => {
        controller.abort(); // Cancel the ongoing API requests to prevent memory leaks.
       }
  },[dialogOpen,data])
 
  const openDialog = (show: Show) => {
    setSelectedShow(show);
    setDialogOpen(true);
    document.body.classList.add('modal-open'); // Adds the CSS class to disable scrolling on body.
  };

  const closeDialog = () => {
    setDialogOpen(false);
    document.body.classList.remove('modal-open'); // Removes the CSS class to re-enable scrolling on body.
  };

  //const seasonsArray = selectedShow?.seasons;
  

  return (
    <div className="preview__container">
      
      {data.map((show) => (
        <div key={show.id}>
         
         <button className="preview__information" onClick={() => openDialog(show)}>
            <img className="preview__img" src={show.image} alt={show.title} />
            <div className="preview__content">
              <h3 className="preview__title">{show.title}</h3>
              <h3> Seasons:{show.seasons}</h3>
              <p>Genres:{show.genres}</p>
              <p>Updated:  {new Date(show.updated).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
            </div>
          </button>
        </div>
      ))}
       
       {dialogOpen && selectedShow &&(
        <div className="dialog__container">
         <div className="blur__background" />
      <dialog  className="dialog">
        <div className='selectedshow__mp3'>
          The mp3 file will display here
        </div>
        <div className='selectedshow__content'>
          <p><span className='content__headings'>Title:</span> {selectedShow.title}</p>
          <p><span className='content__headings'>Seasons:</span> {selectedShow.seasons}</p>
          <p><span className='content__headings'>Updated: </span> {new Date(selectedShow.updated).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
          <p><span className='content__headings'>Description: </span>{selectedShow.description}</p>
        </div>
        <button className="dialog__button" onClick={closeDialog}>Close</button>
      </dialog>
      </div>
    )}
    </div>
    
  );
};