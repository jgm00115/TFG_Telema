import styled from "styled-components";

const FadeWrapper = styled.div`
opacity: ${(props) => (props.visible ? 1 : 0)};
visibility: ${(props) => (props.visible ? "visible" : "hidden")};
transition: opacity 0.5s ease-in-out, visibility 0.5s;
`;

export default FadeWrapper;