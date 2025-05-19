import React from "react";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import Showdown from "showdown";
import "../../css/TextEditor.css";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

export default function TextEditor({ name, value, onChange, tab }) {
  const [selectedTab, setSelectedTab] = React.useState(tab || "write");

  return (
    <div className="container">
      <ReactMde
        id={name}
        name={name}
        value={value}
        onChange={(value) => onChange({ target: { name, value } })}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
        classes={{
          reactMde: "custom-react-mde",
          toolbar: "custom-mde-toolbar",
          textArea: "custom-mde-textarea",
          preview: "custom-mde-preview",
        }}
      />
    </div>
  );
}