import styled from "styled-components";

const StyledOverview = styled.div`
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacings.padding} 2rem 0;

  .list-wrapper {
    overflow-y: auto;

    ::-webkit-scrollbar {
      display: none;
    }
  }

  .sort-container {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: ${({ theme }) => theme.spacings.margin};
    margin-bottom: 0.5rem;
    padding-right: 0.5rem;

    .count span {
      font-size: 1.25rem;
      margin-right: 0.25rem;
      font-weight: bold;
    }

    .buttons {
      position: relative;
      display: flex;
      gap: 10px;

      button {
        display: grid;
        place-items: center;
        border: none;
        cursor: pointer;
        font-size: 1.25rem;
        border-radius: 7px;
        width: 32px;
        aspect-ratio: 1;
        background: ${({ theme }) => theme.colors.bgSecondary};
        outline: none;
        transition: color 300ms;

        &:focus {
          color: ${({ theme }) => theme.colors.hovered.border};
          outline: solid 2px ${({ theme }) => theme.colors.hovered.border};
        }
      }
    }
  }

  ul.grid {
    display: grid;
    font-size: 0.75rem;
    grid-template-columns: repeat(auto-fit, minmax(128px, 160px));
    grid-auto-rows: 1fr;
    grid-gap: 0.5rem;
  }

  ul.list {
    font-size: 1rem;
    list-style: none;
    padding: 0 2px;
  }

  ul.list > li {
    padding: 0.5rem;
    cursor: pointer;
    outline: none;
    border-radius: ${({ theme }) => theme.borderRadius};
    overflow: hidden;
    background: transparent;
    transition: background 300ms, transform 300ms;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
      background: ${({ theme }) => theme.colors.hovered.background};
      outline: solid 1px ${({ theme }) => theme.colors.hovered.border};
    }
  }

  span {
    margin-left: 0.5rem;
  }

  .no-result {
    flex-grow: 1;
    display: grid;
    place-items: center;
  }
`;

export default StyledOverview;
