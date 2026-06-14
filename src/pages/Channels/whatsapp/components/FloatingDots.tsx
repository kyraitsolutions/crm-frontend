const FloatingDots = () => {
  return (
    <div>
      <div className="absolute top-12 left-9 w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_3px_rgba(20,184,166,0.6)] pointer-events-none" />
      <div className="absolute top-[72px] right-[52px] w-[5px] h-[5px] rounded-full bg-blue-400 shadow-[0_0_8px_3px_rgba(59,130,246,0.5)] pointer-events-none" />
      <div className="absolute top-[200px] left-6 w-1 h-1 rounded-full bg-teal-400 shadow-[0_0_6px_2px_rgba(20,184,166,0.5)] pointer-events-none" />
      <div className="absolute top-[260px] right-7 w-[5px] h-[5px] rounded-full bg-[#25D366] shadow-[0_0_8px_3px_rgba(37,211,102,0.45)] pointer-events-none" />
      <div className="absolute bottom-40 right-12 w-1 h-1 rounded-full bg-indigo-400 shadow-[0_0_6px_2px_rgba(99,102,241,0.5)] pointer-events-none" />
      <div className="absolute bottom-20 left-11 w-[3px] h-[3px] rounded-full bg-teal-400 shadow-[0_0_5px_2px_rgba(20,184,166,0.4)] pointer-events-none" />
      <div className="absolute top-[420px] left-[60px] w-1 h-1 rounded-full bg-blue-300 shadow-[0_0_6px_2px_rgba(96,165,250,0.4)] pointer-events-none" />
    </div>
  );
};

export default FloatingDots;
