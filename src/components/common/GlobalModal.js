'use client'

import useModalStore from '@/app/stores/useModalStore'
import ProfileEditModal from '@/components/profile/ProfileEditModal'

export default function GlobalModalLayer() {
  const isProfileModalOpen = useModalStore((state) => state.isProfileModalOpen)
  const closeProfileModal = useModalStore((state) => state.closeProfileModal)

  return (
    <>
      {isProfileModalOpen && <ProfileEditModal onClose={closeProfileModal} />}
    </>
  )
}
