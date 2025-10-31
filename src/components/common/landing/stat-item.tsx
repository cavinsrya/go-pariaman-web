type Props = {
  label: string;
  value: string;
};
export default function StatItem({ label, value }: Props) {
  return (
    <div className="text-center">
      <div className="text-[8px] md:text-sm font-medium text-white leading-5 p-0 m-0">
        {label}
      </div>
      <div className="text-[10px] md:text-2xl font-bold text-white">
        {value}
      </div>
    </div>
  );
}
