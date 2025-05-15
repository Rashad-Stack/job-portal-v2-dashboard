import { useState } from "react";
import FieldModal from "../../components/JobsForms/FieldModal";
import InputField from "../../components/input/InputField";

export default function CreateForms() {
  const [field, setField] = useState([]);
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
    setFieldValues({ title: "", type: "" });
  };

  console.log(fieldValues);

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
                  className={`w-fit p-2 border outline-none border-gray-300 rounded-lg text-white my-3`}
                />
              </div>
            </div>
            {/* {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300">
                {error}
              </div>
            )} */}

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
                      {fieldValues.type === "radio" && (
                        <InputField
                          label="Field name *"
                          name="radio"
                          required
                          onChange={onChange}
                        />
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
                      </select>
                    </div>
                  </div>
                </FieldModal>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {field.map((item, index) => (
                  <div style={{ gridColumn: `span ${item.column}` }}>
                    <InputField
                      key={index}
                      field={item}
                      type={item.type}
                      label={`${item.title} ${item.required ? "*" : ""}`}
                      placeholder={`Enter ${item.title}`}
                    />
                  </div>
                ))}
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}
