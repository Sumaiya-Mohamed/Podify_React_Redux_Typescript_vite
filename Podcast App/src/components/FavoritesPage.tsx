import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { FilterBar } from './FavoritesFilterBar';
import { addToFavorites, removeFromFavorites, clearFavorites } from '../store';

type FavoriteShowData = Array<SelectedShow>;

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

export const FavoritesPage: React.FC = () => {
  const favorites = useSelector((state: RootState) => state.favorites);
  const dispatch = useAppDispatch(); // Use the useDispatch hook

  const [sortOption, setSortOption] = React.useState<string>('');

  const navigate = useNavigate();

  const backToHome = () => {
    navigate('/');
  };
  const handleSearch = (query: string) => {
    // You can handle search logic here if needed
  };

  const handleSort = (option: string) => {
    setSortOption(option);

    if (option !== '') {
      const sortedShows = [...favorites];
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
      dispatch(clearFavorites());
      sortedShows.forEach((show) => {
        dispatch(addToFavorites(show));
      });
    }
  };
  return (
    <div>
      <div className="header__container">
        <div className="left__elements">
          <img className="podcast__img" src="./src/assets/mic.png" alt="mic icon" />
          <h1 className="podcast__name">Podify</h1>
        </div>
        <div className="right__elements">
          <button onClick={backToHome} className="favorites__button">
            Back
          </button>
        </div>
      </div>
      <FilterBar onSearch={handleSearch} onSort={handleSort} />
      <div className="preview__container">
        {favorites.map((show) => (
          <div key={show.id} className={`preview__information ${favorites.length === 1 ? 'preview__information-large' : ''}`}>
            <div>
              <img className={`preview__img ${favorites.length === 1 ? 'preview__img-large' : ''}`} src={show.image} alt={show.title} />
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
              <p>Updated: {new Date(show.updated).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
``
