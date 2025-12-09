import LoginPageContent from "./LoginPageContent";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <LoginPageContent />
      {children}
    </div>
  );
}
