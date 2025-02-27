import { useEffect, useState } from "react";
import styled from "styled-components";
import FourFortyVideoPlayer from "../components/video/FourFortyVideoPlayer";
import { useGetOrientation } from "../hooks/useGetOrientation";
import useSettings from "../hooks/useSettings";
import useEvent from "../hooks/useEvent";

const VideoContainer = styled.div`
  background-color: black;
  width: 100vw;
  height: 100vh;
`;

export default function VideoPlayerScreen({ route, navigation }) {
  const { settings } = useSettings();
  const { event, handleUpdateEventStream } = useEvent();
  const { orientation } = useGetOrientation();

  const selectedEventStream =
    settings["video-location"] &&
    event.eventStreams?.[settings["video-location"]]
      ? event.eventStreams?.[settings["video-location"]]
      : undefined;

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [orientation]);

  const handleOnEnd = () => {
    if (!selectedEventStream) return;
    handleUpdateEventStream({ id: selectedEventStream.id, hasEnded: true });
  };

  const handleOnStart = () => {
    if (!selectedEventStream) return;
    handleUpdateEventStream({ id: selectedEventStream.id, hasEnded: false });
  };

  const handleLocationPress = () => {
    navigation.navigate("Select Location");
  };

  const getErrorMessage = () => {
    if (!selectedEventStream) return "No location set, please select a location to continue";
    if (selectedEventStream.status === "INTERRUPTED")
      return "We're sorry but the stream has temporarily been interrupted. Please wait.";
    if (selectedEventStream.status === "FINISHED" && !selectedEventStream.dataStreaming && selectedEventStream.hasEnded)
      return "This stream has now finished. Thanks for watching!";
    return undefined;
  };

  return (
    <VideoContainer>
      <FourFortyVideoPlayer
        width={dimensions.width}
        height={dimensions.height}
        videoUrl={selectedEventStream?.url || ""}
        title={route.params?.title || undefined}
        onBackPress={handleLocationPress}
        onEnd={handleOnEnd}
        onStart={handleOnStart}
        onLocationPress={handleLocationPress}
        errorMessage={getErrorMessage()}
        isLive={selectedEventStream?.status === "STREAMING"}
        isFullscreen
        videoAspect={selectedEventStream?.videoAspect}
      />
    </VideoContainer>
  );
}
