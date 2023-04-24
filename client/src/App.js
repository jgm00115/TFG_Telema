import logo from './logo.svg';
import Stream from './pages/Stream.jsx';
import StreamList from './pages/StreamList.jsx';
import './App.css';

import {useState} from 'react';
import StreamingList from './pages/StreamList.jsx';

function App() {

  const [selectedStreaming, setSelectedStreaming] = useState(null);

  console.log(`Selected Streaming = ${JSON.stringify(selectedStreaming)}`);

  /* Si hay un streaming seleccionado renderiza la vista de streaming
  * Si no, renderiza una vista con los streamings disponibles
  */
  return (
    <>
      {selectedStreaming ? (
          <Stream
            mediaURL={`media/${selectedStreaming._id}/manifest.mpd`}
          />
      ) : (
        <StreamingList
          setSelectedStreaming={setSelectedStreaming}
        />
      )}
    </>
  );
}

export default App;