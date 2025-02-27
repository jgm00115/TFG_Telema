import Page from "../components/core/Page";
import Message from "../components/core/Message";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`;

export default function ErrorScreen({ title, onBack, message = "There has been a problem, please try again later" }) {
  return (
    <Page title={title} onBackPress={onBack}>
      <Container>
        <Message text={message} />
      </Container>
    </Page>
  );
}
