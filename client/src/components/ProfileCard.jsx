import { formatCount } from '../lib/format';

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <div className="font-semibold text-gray-900">{formatCount(value)}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function ProfileCard({ user }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 sm:flex-row sm:items-start">
      <img
        src={user.avatarUrl}
        alt={user.login}
        className="h-24 w-24 rounded-full"
      />

      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-xl font-semibold text-gray-900">
          {user.name || user.login}
        </h2>
        <a
          href={user.htmlUrl}
          target="_blank"
          rel="noreferrer"
          className="text-gray-500 hover:underline"
        >
          @{user.login}
        </a>

        {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}

        <div className="mt-4 flex justify-center gap-6 sm:justify-start">
          <Stat label="Followers" value={user.followers} />
          <Stat label="Following" value={user.following} />
          <Stat label="Repos" value={user.publicRepos} />
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
