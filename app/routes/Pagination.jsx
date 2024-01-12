import { Button } from "@shopify/polaris";

const Pagination = ({ handlePrevPage, handleNextPage, skip, take }) => {
  return (
    <div>
      <div style={{ marginTop: "20px" }}>
        <Button onClick={handlePrevPage} disabled={skip === 0}>
          Previous Page
        </Button>
        <span style={{ margin: "0 10px" }}>
          Page {Math.ceil(skip / take) + 1}
        </span>
        <Button onClick={handleNextPage}>Next Page</Button>
      </div>
    </div>
  );
};

export default Pagination;
