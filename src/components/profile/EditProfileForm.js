'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { showError, showSuccess } from '@/lib/toast'
import Image from 'next/image'
import useUserStore from '@/app/stores/useUserStore'

export default function EditProfileForm({ onClose }) {
  const user = useUserStore((state) => state.user)
  const fetchUser = useUserStore((state) => state.fetchUser)
  const [nickname, setNickname] = useState('')
  const [blogName, setBlogName] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET

  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setNickname(profile.nickname || '')
        setBlogName(profile.blog_name || '')
        setPreviewUrl(profile.profile_url || '/userprofile.png')
      }
    }

    fetchProfile()
  }, [user])

  const sanitizeFilename = (name) =>
    name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_.-]/g, '')

  const handleSave = async (e) => {
    e.preventDefault()
    if (!user) return

    let imageUrl = previewUrl

    if (profileImage) {
      const safeName = `${Date.now()}_${sanitizeFilename(profileImage.name || 'profile')}`
      const filePath = `profiles/${user.id}/${safeName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, profileImage)

      if (!uploadError) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
        imageUrl = data.publicUrl
      }
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ nickname, blog_name: blogName, profile_url: imageUrl })
      .eq('id', user.id)

    if (updateError) {
      showError('프로필 수정이 실패하였습니다.')
      return
    }

    // ✅ Zustand 전역 유저 상태 업데이트
    await fetchUser()

    showSuccess('프로필이 성공적으로 수정되었습니다!')
    onClose()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  return (
    <form onSubmit={handleSave} className="w-full flex flex-col items-center">
      <label htmlFor="profileImage" className="cursor-pointer mb-6">
        <Image
          src={previewUrl || '/userprofile.png'}
          alt="프로필 이미지"
          width={120}
          height={120}
          className="rounded-md object-cover"
        />
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>

      <div className="w-full space-y-4">
        <div className="w-full">
          <label className="block text-sm text-gray-500 mb-1">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full bg-[#F5F5F5] text-sm rounded-md px-4 py-2"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm text-gray-500 mb-1">블로그 이름</label>
          <input
            type="text"
            value={blogName}
            onChange={(e) => setBlogName(e.target.value)}
            className="w-full bg-[#F5F5F5] text-sm rounded-md px-4 py-2"
          />
        </div>
      </div>

      {errorMsg && <p className="text-red-500 text-sm my-3 text-center">{errorMsg}</p>}

      <button
        type="submit"
        className="w-full mt-6 bg-black text-white text-sm font-semibold py-2 rounded-md hover:bg-[#222]"
      >
        수정하기
      </button>
    </form>
  )
}
