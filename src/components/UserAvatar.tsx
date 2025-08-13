import { useUserStore } from '@/stores/userStore'

const UserAvatar = () => {
  const { user } = useUserStore()

  if (user?.profilePicture) {
    return (
      <img
        src={user.profilePicture}
        alt={user.displayName || 'User'}
        className="w-10 h-10 rounded-full object-cover"
      />
    )
  }

  const displayName = user?.displayName || 'User'
  const firstLetter = displayName.charAt(0).toUpperCase()

  return (
    <div className="w-10 h-10 rounded-full bg-primary-A400 flex items-center justify-center">
      <span className="text-white font-medium text-lg">
        {firstLetter}
      </span>
    </div>
  )
}

export default UserAvatar

