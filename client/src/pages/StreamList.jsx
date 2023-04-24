import {useEffect, useState} from 'react';

export default function StreamingList({setSelectedStreaming}){

    const [streamingData, setStreamingData] = useState([]);

    function handleClick(event){
        const streamID = event.target.id;
        const selectedStreaming = streamingData.find(
            (stream)=> stream._id == streamID);
        setSelectedStreaming(selectedStreaming);
    }

    // Recupera la info de todos los streamings
    useEffect(()=> {
        fetch('/stream/')
        .then((response) => response.json())
        .then((data) => {
            setStreamingData(data);
        });
    },[]);

    console.log(`Streamings data = ${JSON.stringify(streamingData)}`);

    return (
        <>
            <ul>
                {streamingData.map((stream) => {
                    return(
                    <li key={stream._id} >
                        <p id={stream._id} onClick={handleClick}>
                            {stream.title}
                        </p>
                    </li>
                    );
                })}    
            </ul>
        </>
    );
}