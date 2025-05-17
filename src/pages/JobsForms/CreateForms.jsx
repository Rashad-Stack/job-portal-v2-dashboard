import { useState } from "react";
import FieldModal from "../../components/JobsForms/FieldModal";
import Button from "../../components/button/Button";
import InputField from "../../components/input/InputField";

export default function CreateForms() {
  const [field, setField] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [fieldValues, setFieldValues] = useState({
    title: "",
    required: false,
    column: 12,
    type: "text",
    options: [
      {
        radio: {
          label: "",
          value: "",
        },
      },
    ],
  });

  const onChange = (e) => {
    if (e.target.name === "column") {
      return setFieldValues({
        ...fieldValues,
        [e.target.name]: Number(e.target.value),
      });
    }

    if (e.target.name === "radio") {
      return setFieldValues({
        ...fieldValues,
        options: [
          ...fieldValues.options,
          {
            radio: {
              label: e.target.value,
              value: e.target.value.toLowerCase().replace(" ", "_"),
            },
          },
        ],
      });
    }

    setFieldValues({ ...fieldValues, [e.target.name]: e.target.value });
  };

  const handleAddField = () => {
    setField([...field, fieldValues]);
    setFieldValues({
      title: "",
      required: false,
      column: 12,
      type: fieldValues.type,
      options: [
        {
          radio: {
            label: "",
            value: "",
          },
        },
      ],
    });
  };

  const handleSave = () => {
    console.log({ formTitle, field });
  };

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border bottom-1 border-slate-200 rounded-2xl overflow-hidden">
          <form className="space-y-6" method="post" action="/add-form">
            <div className="p-6 bg-gradient-to-r from-[#00ab0c] to-[#00ab0c]">
              <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
                Create New Job Post form
              </h1>
              <div>
                <input
                  id="formTitle"
                  type="text"
                  name="formTitle"
                  required={true}
                  placeholder="Form Title"
                  onChange={(e) => setFormTitle(e.target.value)}
                  className={`w-fit p-2 border outline-none border-gray-300 rounded-lg text-white my-3`}
                />
              </div>
            </div>

            {/* Basic Information */}
            <section className="space-y-4 text-left p-6">
              <div className="border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 pb-2 ">
                  Basic Information
                </h2>

                <FieldModal title="Add Field" handleAddField={handleAddField}>
                  <div action="" className="flex gap-4 items-center">
                    <div>
                      <InputField
                        label="Field name *"
                        name="title"
                        required
                        onChange={onChange}
                      />
                      {(fieldValues.type === "radio" ||
                        fieldValues.type === "select") && (
                        <>
                          {fieldValues?.options &&
                            fieldValues?.options.map((option, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 mt-2">
                                <InputField
                                  label={`Option ${index + 1} Name *`}
                                  name={`radio-${index}`}
                                  value={option.radio.label}
                                  required
                                  onChange={(e) => {
                                    const updatedOptions = [
                                      ...fieldValues.options,
                                    ];
                                    updatedOptions[index].radio.label =
                                      e.target.value;
                                    updatedOptions[index].radio.value =
                                      e.target.value
                                        .toLowerCase()
                                        .replace(" ", "_");
                                    setFieldValues({
                                      ...fieldValues,
                                      options: updatedOptions,
                                    });
                                  }}
                                  divClass="flex-grow"
                                />
                                {fieldValues.options.length > 1 && (
                                  <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => {
                                      const updatedOptions =
                                        fieldValues.options.filter(
                                          (_, i) => i !== index
                                        );
                                      setFieldValues({
                                        ...fieldValues,
                                        options: updatedOptions,
                                      });
                                    }}>
                                    ✕
                                  </button>
                                )}
                              </div>
                            ))}
                          <Button
                            label={"Add more Option"}
                            className="mt-2"
                            onClick={() =>
                              setFieldValues({
                                ...fieldValues,
                                options: [
                                  ...fieldValues.options,
                                  {
                                    radio: {
                                      label: "",
                                      value: "",
                                    },
                                  },
                                ],
                              })
                            }
                          />
                        </>
                      )}
                    </div>

                    <div className="space-x-2">
                      <input
                        type="checkbox"
                        name="required"
                        id="required"
                        onChange={onChange}
                      />
                      <label htmlFor="required">Required</label>
                    </div>
                    <div>
                      <label htmlFor="column">Column</label>
                      <select name="column" id="column" onChange={onChange}>
                        <option value="12">1</option>
                        <option value="6">2</option>
                        <option value="4">3</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="type">Type</label>
                      <select name="type" id="type" onChange={onChange}>
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="radio">Radio</option>
                        <option value="select">Select</option>
                      </select>
                    </div>
                  </div>
                </FieldModal>
              </div>

              {/* Rendered Field */}
              <div className="grid grid-cols-12 gap-4">
                {field.map((item, index) => {
                  console.log("field item", item);
                  return (
                    <div
                      key={index}
                      style={{ gridColumn: `span ${item.column}` }}>
                      {item.type === "radio" ? (
                        <div>
                          <label className="block font-semibold mb-2">
                            {item.title} {item.required && "*"}
                          </label>
                          <div className="flex gap-4">
                            {item.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id={`radio-${index}-${optIndex}`}
                                  name={`radio-${index}`}
                                  value={option.radio.value}
                                />
                                <label htmlFor={`radio-${index}-${optIndex}`}>
                                  {option.radio.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : item.type === "select" ? (
                        <div>
                          <label className="block font-semibold mb-2">
                            {item.title} {item.required && "*"}
                          </label>
                          <select
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            name={`select-${index}`}
                            defaultValue="">
                            <option value="" disabled>
                              Select {item.title}
                            </option>
                            {item.options.map((option, optIndex) => (
                              <option key={optIndex} value={option.radio.value}>
                                {option.radio.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <InputField
                          field={item}
                          type={item.type}
                          label={`${item.title} ${item.required ? "*" : ""}`}
                          placeholder={`Enter ${item.title}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Save Action */}
              {field && field.length > 0 && (
                <Button label={"Save This Template"} onClick={handleSave} />
              )}
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}
