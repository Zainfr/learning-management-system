import React from "react";
import DocViewer, { PDFRenderer } from "react-doc-viewer";

const ViewDocument = ({ docs }) => {
  return <DocViewer documents={docs} pluginRenderers={[PDFRenderer]} />;
};

export default ViewDocument;
