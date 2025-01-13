export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
        <img src='logo.png' alt='Logo' />
      </div>
      <span className="font-bold text-xl text-gray-900">AL ZAEEM AI</span>
    </div>
  );
}