export default function GlassCard({ title, children, className = "" }) {
  return (
    <div className={`glass p-6 ${className}`} data-aos="fade-up">
      {title && <h3 className="text-xl font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
