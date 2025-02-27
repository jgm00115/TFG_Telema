import React from "react";
import styled from "styled-components";
import Header from "./Header";
import BackgroundImage from "./BackgroundImage";
import Container from "./Container";

const SafeArea = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const MainView = styled.div`
  flex-grow: 1;
  padding: 48px 24px;
`;

const Page = ({ children, title, onBackPress }) => {
  return (
    <BackgroundImage>
      <SafeArea>
        <Container>
          {title && <Header onBackPress={onBackPress} title={title} />}
          <MainView>{children}</MainView>
        </Container>
      </SafeArea>
    </BackgroundImage>
  );
};

export default Page;
