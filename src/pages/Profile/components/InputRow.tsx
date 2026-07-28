const InputRow = ({
  label,
  name,
  formData,
  setFormData,
  isTextArea = false,
}: any) => {


  const getValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  const setValue = (obj: any, path: string, value: any) => {
    const updated = structuredClone(obj); // or lodash.cloneDeep

    const keys = path.split(".");
    let current = updated;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;

    return updated;
  };


  return (
    <div className="grid grid-cols-[180px_1fr] items-start w-full">
      <label className="text-sm text-slate-600 text-right pr-6 mt-2">
        {label}
      </label>

      {isTextArea ? (
        <textarea
          className="border rounded px-3 py-2 text-sm focus:border-primary outline-none"
          // value={formData[name]}
          value={getValue(formData, name) ?? ""}
          onChange={(e) => setFormData(setValue(formData, name, e.target.value))}
        />
      ) : (
        <input
          className="border rounded h-10 px-3 text-sm focus:border-primary outline-none w-full"
          // value={formData[name]}
          value={getValue(formData, name) ?? ""}
          // onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
          onChange={(e) => setFormData(setValue(formData, name, e.target.value))}
        />
      )}
    </div>
  );
};

export default InputRow;
