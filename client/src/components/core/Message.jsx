import React from "react";
import styled from "styled-components";

const MessageText = styled.p`
  color: ${({ theme }) => theme.message.color};
  padding: 32px;
  text-align: center;
`;

const Message = ({ text }) => <MessageText>{text}</MessageText>;

export default Message;
