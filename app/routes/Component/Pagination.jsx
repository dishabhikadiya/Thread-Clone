import React from "react";
import { Button, ButtonGroup } from "@shopify/polaris";

const PaginationComponent = ({
  handlePrevPage,
  handleNextPage,
  handlePageChange,
  currentPage,
  renderPageNumbers,
  totalPages,
}) => {
  return (
    <span style={{ display: "flex", justifyContent: "center" }}>
      <Button onClick={handlePrevPage} disabled={currentPage === 1}>
        Previous Page
      </Button>
      &nbsp; &nbsp;
      <ButtonGroup>{renderPageNumbers()}</ButtonGroup>
      &nbsp; &nbsp;
      <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
        Next Page
      </Button>
    </span>
  );
};

export default PaginationComponent;
