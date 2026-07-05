interface Props {
  children: React.ReactNode;
  sectionKey: string;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
}

const SectionWrapper = ({ children, sectionKey, sectionRefs }: Props) => {
  return (
    <div
      ref={(el) => {
        sectionRefs.current[sectionKey] = el;
      }}
    >
      {children}
    </div>
  );
};

export default SectionWrapper;
