import { Controller } from "react-hook-form";
import CustomSelect from "../input/CustomSelect";
import InputField from "../input/InputField";
import InputLabel from "../input/InputLabel";


const DynamicFieldRenderer = ({ field, index, register, control }) => {
  const commonProps = {
    key: field.id || index,
    name: `fields.${index}.value`,
  };

  switch (field.type) {
    case "text":
      return (
        <InputField
          {...commonProps}
          label={field.title}
          type="text"
          placeholder={`Enter ${field.title}`}
          {...register(`fields.${index}.value`)}
        />
      );
    case "number":
      return (
        <InputField
          {...commonProps}
          label={field.title}
          type="number"
          placeholder={`Enter ${field.title}`}
          {...register(`fields.${index}.value`)}
        />
      );
    case "date":
      return (
        <InputField
          {...commonProps}
          label={field.title}
          type="date"
          {...register(`fields.${index}.value`)}
        />
      );
    case "radio":
      return (
        <div>
          <InputLabel labelTitle={{ title: field.title }} />
          <div className="flex gap-4">
            {field.options?.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={`radio-${index}-${optIndex}`}
                  value={option.value}
                  {...register(`fields.${index}.value`)}
                  className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <label
                  htmlFor={`radio-${index}-${optIndex}`}
                  className="text-gray-700 text-sm"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    case "select":
      return (
        <div>
          <label htmlFor={`fields.${index}.value`}>{field.title}</label>
          <Controller
            name={`fields.${index}.value`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomSelect
                id={`fields.${index}.value`}
                name={`fields.${index}.value`}
                value={value || ""}
                onChange={onChange}
                options={field.options.map((opt) => ({
                  label: opt.label,
                  value: opt.value,
                }))}
                disabledOption={`Select ${field.title}`}
              />
            )}
          />
        </div>
      );
    default:
      return null;
  }
};

export default DynamicFieldRenderer;