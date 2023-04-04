import styled, { keyframes } from "styled-components";

const StyledForm = styled.form<{ arrowDown: boolean }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);

  .field {
    flex-grow: 1;
    display: flex;
  }

  .select {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    cursor: default;
    user-select: none;

    svg {
      transform: ${({ arrowDown }) => `rotate(${arrowDown ? 0 : 180}deg)`};
      transition: transform 200ms linear;
    }
  }

  .options {
    z-index: 20;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin-top: 1px;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(5px);
    box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.4);
    transform-origin: top center;
    transform: ${({ arrowDown }) => `scaleY(${arrowDown ? 0 : 1})`};
    transition: transform 200ms ease-in-out;

    div {
      color: ${({ theme }) => theme.colors.option};
      font-size: 1rem;
      padding: 0.4rem 1.75rem;
      cursor: pointer;
      background: transparent;
      transition: background 300ms;

      &:hover {
        background: rgba(255, 255, 255, 0.5);
      }
    }
  }

  input {
    background: transparent;
    border: none;
    outline: none;
    flex-grow: 1;
    padding-left: 1rem;
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.75);
  }

  button {
    border: none;
    background: transparent;
  }

  svg {
    font-size: 1.5rem;
  }
`;

export default StyledForm;
