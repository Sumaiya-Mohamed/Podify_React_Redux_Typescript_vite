import React, { useState} from "react";

type AllShowData = Array<ShowPreview>;

type ShowPreview = {
  id: string;
  title: string;
  description: string;
  image: string;
  seasons: Seasons;
  genres: Array<string>;
  updated: Date;
};

type Seasons = Array<Season>;

type Season = {
  season: number;
  title: string;
  image: string;
  episodes: Array<Episodes>;
};

type Episodes = {
  title: string;
  description: string;
  episode: number;
  file: string;
};


type FilterBarProps = {
  filteredShows: AllShowData;
  onSort: (sortOption: string) => void; 
  onSearch: (query: string) => void;
  allGenres: Array<string>;
  handleGenreFilter: (genre: string) => void;
};

export const FilterBar: React.FC<FilterBarProps> = ({ onSearch, filteredShows, onSort, allGenres, handleGenreFilter }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortShows, setSortShows] = useState<string>('');
  const [genre, setGenre] = useState<string>('')

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchQuery);
  };


  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOption = event.target.value;
    setSortShows(sortOption);
    onSort(sortOption); // Pass the selected option to the onSort(prop) function.
  };

  const handleSortGenre = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const genre = event.target.value;
    setGenre(genre); 
    handleGenreFilter(genre); // Pass the selected genre to the handleGenreFilter(prop) function.
  };
  return (
    <div>
      <h3 className="heading__check">Check out our available shows!</h3>
      <div className="filter__bar">
        <form className="search__container" onSubmit={handleSubmit}>
          <label htmlFor="search" className="search__label">
            Search
          </label>
          <input
            type="search"
            id="search"
            name="search"
            value={searchQuery}
            onChange={handleSearch}
            required
            className="search__input"
          />
        </form>

        <div className="sort__container">
          <div className="filter__heading">
            <p>Sort By:</p>
          </div>
          <select 
          className="filter__select"
          value={sortShows}
           onChange={handleSort}
          >
            <option value="">Sort by</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
            <option value="most recent">MOST RECENT</option>
            <option value="least recent">LEAST RECENT</option>
          </select>
        </div>

        <div className="genre__container">
          <div className="genre__heading">
            <p>Genre:</p>
          </div>
          <select className="genre__select" value={genre} onChange={handleSortGenre}>
          <option value="">All Genres</option>
          {allGenres.map((genre,index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        </div>
      </div>
    </div>
  );
};
