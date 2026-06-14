export function BackgroundGlow() {
  return (
    <>
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-linear-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-linear-to-br from-cyan-500/20 via-sky-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-emerald-500/10 to-cyan-500/5 blur-3xl pointer-events-none" />
    </>
  );
}
