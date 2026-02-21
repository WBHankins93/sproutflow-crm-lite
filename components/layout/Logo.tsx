import Image from 'next/image'

export function Logo() {
  return (
    <div className="flex items-center justify-end h-full pr-4">
      <Image
        src="/logo.png"
        alt="Sproutflow Logo"
        width={120}
        height={40}
        className="object-contain"
        priority
      />
    </div>
  )
}
