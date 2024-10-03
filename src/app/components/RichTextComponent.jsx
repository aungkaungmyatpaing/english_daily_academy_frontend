import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const RichTextComponent = ({ richTextDocument }) => {
  // Check if richTextDocument exists
  if (!richTextDocument) {
    return <div>Loading content...</div>;
  }

  // Handle HTML content
  return (
    <div
      dangerouslySetInnerHTML={{ __html: richTextDocument }} // Render HTML content safely
    />
  );
};

export default RichTextComponent;
