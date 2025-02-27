import styled from "styled-components";
import LargeHeader from "../components/core/LargeHeader";
import Container from "../components/core/Container";
import useSettings from "../hooks/useSettings";
import ImageRadio from "../components/forms/ImageRadio";
import useEvent from "../hooks/useEvent";

const SafeArea = styled.div`
  flex-grow: 1;
  background-color: ${({ theme }) => theme.general.backgroundColour};
`;

const MainView = styled.div`
  flex-grow: 1;
  padding: 48px 0;
`;

export default function SelectLocationScreen({ navigation }) {
  const { settings, handleUpdateSettings } = useSettings();
  const { activeStreams } = useEvent();

  const locationOptions = activeStreams.map((stream) => ({
    name: stream.location,
    value: String(stream.id),
    image: stream.thumbnail,
  }));

  const handleOnClose = () => navigation.navigate("Video Player");

  const handleLocationChange = (name, value) => {
    handleUpdateSettings(name, value);
    navigation.navigate("Video Player");
  };

  return (
    <SafeArea>
      <Container>
        <LargeHeader onBack={() => navigation.navigate("Onboarding")} onClose={settings["video-location"] ? handleOnClose : undefined} title="Location" />
        <MainView>
          <ImageRadio name="video-location" options={locationOptions} formData={settings} onChange={handleLocationChange} styleType="dark" />
        </MainView>
      </Container>
    </SafeArea>
  );
}
