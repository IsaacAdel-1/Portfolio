export default function Background() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute -top-[120px] -right-[80px] w-[420px] h-[420px] rounded-full blur-[40px] bg-[radial-gradient(circle,rgba(56,138,221,0.20),transparent_65%)]" />
      <div className="absolute bottom-[10%] -left-[100px] w-[380px] h-[380px] rounded-full blur-[40px] bg-[radial-gradient(circle,rgba(56,138,221,0.12),transparent_65%)]" />
    </div>
  );
}
