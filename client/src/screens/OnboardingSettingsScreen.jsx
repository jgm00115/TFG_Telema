import Page from "../components/core/Page";
import SteppedForm from "../components/forms/SteppedForm";
import Button from "../components/core/Button";
import useSettings from "../store/hooks/useSettings";
import { useParams, useNavigate } from "react-router-dom";

export default function OnboardingSettingsScreen({ route }) {
  const { settings, handleUpdateSettings } = useSettings();

  const { title, onBack } = useParams();
    const navigate = useNavigate();

  const STEPPED_FORM_ITEMS = [
    {
      title: "Location",
      text: "This performance offers various views...",
      fields: [
        { name: "video-location", type: "image-radio", options: [
            { name: "Stage", value: "stage", image: "https://placehold.co/320x180" },
            { name: "Balcony", value: "balcony", image: "https://placehold.co/320x180" },
            { name: "Percussion", value: "percussion", image: "https://placehold.co/320x180" },
            { name: "Rear", value: "rear", image: "https://placehold.co/320x180" }
        ] },
      ],
    },
    { title: "Video", text: "Choose between standard or 360° video.", fields: [{ name: "video-mode", type: "switch", options: [{ name: "Standard", value: "standard" }] }] },
    { title: "Audio", text: "Select SSS or ambisonic.", fields: [{ name: "audio-mode", type: "switch", options: [{ name: "SSS", value: "sss" }, { name: "Ambisonic", "value": "ambisonic"}] }] },
    {
      title: "Ready to Start?",
      text: "Click below to begin.",
      fields: [],
      renderAfterFields: () => <Button text="Start Concert" onClick={() => navigate("/streaming/")} />,
    },
  ];

  return (
    <Page title={title || undefined} onBackPress={onBack || undefined}>
      <SteppedForm items={STEPPED_FORM_ITEMS} formData={settings} onChange={handleUpdateSettings} />
    </Page>
  );
}
