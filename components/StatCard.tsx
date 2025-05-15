interface StatCardProps {
  title: string;
  value: number;
  className?: string;
}

export default function StatCard({ title, value, className = '' }: StatCardProps) {
  return (
    <div 
      className={`
        rounded-2xl p-6 text-white h-[200px] w-full 
        flex flex-col justify-center items-center
        transition-transform duration-200 ease-in-out
        hover:scale-[1.02] focus-within:scale-[1.02]
        touch-target
        ${className}
      `}
    >
      <h3 className="text-xl font-medium mb-4">{title}</h3>
      <div className="text-5xl font-bold text-center">{value}</div>
    </div>
  );
}