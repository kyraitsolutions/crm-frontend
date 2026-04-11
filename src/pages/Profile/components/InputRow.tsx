const InputRow = ({
  label,
  name,
  formData,
  setFormData,
  isTextArea = false,
}: any) => {
  return (
    <div className="grid grid-cols-[180px_1fr] items-start">
      <label className="text-sm text-slate-600 text-right pr-6 mt-2">
        {label}
      </label>

      {isTextArea ? (
        <textarea
          className="border rounded px-3 py-2 text-sm focus:border-primary outline-none"
          value={formData[name]}
          onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        />
      ) : (
        <input
          className="border rounded h-10 px-3 text-sm focus:border-primary outline-none"
          value={formData[name]}
          onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        />
      )}
    </div>
  );
};

export default InputRow;
