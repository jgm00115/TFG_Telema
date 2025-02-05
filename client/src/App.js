import logo from './logo.svg';
import Stream from './pages/Stream.jsx';
import StreamList from './pages/StreamList.jsx';
import './App.css';

import {useState} from 'react';
import StreamingList from './pages/StreamList.jsx';

function App() {

  const [selectedStreaming, setSelectedStreaming] = useState(null);

  console.log(`Selected Streaming = ${JSON.stringify(selectedStreaming)}`);

  /* If there is a selected streaming, render the streaming view
  * If not, render a view with the available streamings
  */
  return (
    <>
      {selectedStreaming ? (
          <Stream
            streaming={selectedStreaming}
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