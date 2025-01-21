import Markdown from "react-markdown";


const MarkdownRenderer = ({children}: { children: string }) => {
  return <Markdown className='markdown-container'>{children}</Markdown>
};

export default MarkdownRenderer;
