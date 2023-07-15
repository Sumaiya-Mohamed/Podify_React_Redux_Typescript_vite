import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Carousal } from './components/Carousal'

type Show = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const App: React.FC = () => {
  const [podcastData, setPodcastData] = useState<Show[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app/shows');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: Show[] = await response.json();
        if (Array.isArray(json)) {
          setPodcastData(json);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    void fetchData();
  }, []);
    
  return (
    <div>
      <Header />
      <br></br>
      <Carousal 
       data= {podcastData}
      />
      
    </div>
  );
}

export default App;


