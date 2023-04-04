import styled, { keyframes } from "styled-components";

const showPlayButton = keyframes`
  from {
    opacity: 0;
    transform: translateY(0);
  } to {
    opacity: 1;
    transform: translateY(-10px);
  }
`;

const StyledHomeContent = styled.div`
  background: ${({ theme }) =>
    `linear-gradient(to bottom left, ${theme.colors.homeContentBg.start}, ${theme.colors.homeContentBg.end})`};
  background: ${({ theme }) => theme.colors.bgTertiary};
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  .header {
    height: 32%;
    min-height: 230px;
    background: url(/images/background.png);
    background-size: cover;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: ${({ theme }) => theme.spacings.padding};
  }

  .texts {
    color: white;
    margin-top: 1rem;

    p {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .play-button {
    margin-bottom: 1rem;
  }

  .header button {
    width: 60px;
    height: 60px;
    border-radius: 100%;
    overflow: hidden;
    display: grid;
    place-items: center;
    font-size: 1.25rem;
    cursor: pointer;
    border: none;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
    animation: ${showPlayButton} 500ms 1s both;

    &:active {
      box-shadow: 0 0 5px rgba(0, 0, 0, 1) inset;
    }

    svg {
      transform: translateX(1px);
    }
  }

  input {
    background: transparent;
    outline: none;
    border: none;

    &::placeholder {
      padding-left: 1.25rem;
      color: ${({ theme }) => theme.colors.placeholder};
    }
  }

  .texts > * {
    margin: unset;
  }

  .player-placeholder {
    height: 14%;
    min-height: 100px;
    background: red;
  }

  .inner {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: hidden;
  }

  .searchbar {
    display: flex;
    padding: 1.5rem 2rem 1rem;
    padding-left: 3rem;
    justify-content: space-between;
    align-items: baseline;

    & > div:not(.input) span {
      font-weight: bold;
    }

    .input {
      position: relative;
      border-bottom: solid 1px ${({ theme }) => theme.colors.placeholder};

      input:focus + span {
        display: none;
      }

      span {
        position: absolute;
        left: 0;
        color: ${({ theme }) => theme.colors.placeholder};
        bottom: -2px;
      }
    }
  }
`;

export default StyledHomeContent;
