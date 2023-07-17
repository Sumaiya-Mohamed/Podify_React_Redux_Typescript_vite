
import React, { useState } from 'react';

type Show = {
  id: string;
  title: string;
  description: string;
  image: string;
  season: object[];
  episode: object[];
  genres: number[];
  updated: Date;
};

type PodcastPreviewProps = {
  data: Show[];
  dialog: boolean;
  season: Season;
  episode: Episode;
};

type Season = {
  title: string;
  image: string;
  episodes: Episode[];
};

type Episode = {
  title: string;
  description: string;
  episode: number;
  file: string;
};

export const PodcastPreview: React.FC<PodcastPreviewProps> = ({
  data,
  dialog,
  season,
  episode
}) => {
  const [dialogOpen, setDialogOpen] = useState(dialog);

  const openDialog = () => {
    setDialogOpen(true);
    console.log("the thing is open")
  };

  return (
    <div className="preview__container">
      {data.map((show) => {
        const updatedDate = new Date(show.updated);
        const updatedYear = updatedDate.getFullYear();

        return (
          <div key={show.id}>
              {dialogOpen && (
             <dialog className="dialog__container" >
              <h3>Hi there</h3>
                  {episode.map((episode) => (
                <div key={episode.title}>
                <h3>{episode.title}</h3>
                <p>{episode.description}</p>
                <audio controls>
                 <source src={episode.file} type="audio/mpeg" />
                   Your browser does not support the audio element.
                 </audio>
                </div>
               ))}
             </dialog>
             )}

            <button className="preview__information" onClick={openDialog}>
              <img className="preview__img" src={show.image} alt={show.title} />
              <div className="preview__content">
                <h3 className="preview__title">{show.title}</h3>
                <h3>Seasons: {show.seasons}</h3>
                <h3>Released: {updatedYear}</h3>
                <p className="preview__description">Description: {show.description}</p>
              </div>
            </button>
          </div>
        );
      })}
    
    </div>
  );
};
