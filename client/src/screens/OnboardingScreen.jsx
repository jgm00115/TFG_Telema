import Page from "../components/core/Page";
import Card from "../components/core/Card";
import Button from "../components/core/Button";
import CardFooter from "../components/core/CardFooter";
import Title from "../components/typography/Title";
import Paragraph from "../components/typography/Paragraph";
import TextBlock from "../components/typography/TextBlock";

export default function OnboardingScreen({ title, onBack}) {

    const event = {
        introduction: "Welcome to the event! Please select your seat location to continue."
    }

  return (
    <Page title={title || undefined} onBackPress={onBack || undefined}>
      <Card>
        <Title text="Welcome" />
        {!!event.introduction && (
          <TextBlock>
            <Paragraph text={event.introduction} />
          </TextBlock>
        )}

        <CardFooter>
          <Button text="Select seat location" type="primary" />
        </CardFooter>
      </Card>
    </Page>
  );
}
