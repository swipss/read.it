export default function DefaultProfileImage({
  username,
  style,
}: {
  username: string | undefined;
  style?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center flex-shrink-0 w-10 h-10
       rounded-full bg-brand-brown ${style}`}
    >
      <p className="text-2xl font-bold text-brand-white">
        {username?.[0].toUpperCase()}
      </p>
    </div>
  );
}
