interface AuthCardProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="text-gray-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}