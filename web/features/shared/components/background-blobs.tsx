export default function BackgroundBlobs() {
  return (
    <>
      <div className="fixed inset-0 grid-bg opacity-20" />
      <div className="fixed top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
    </>
  )
}