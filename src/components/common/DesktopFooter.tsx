'use client'

export default function DesktopFooter() {
  return (
    <footer className="w-full bg-white border-t py-6 px-4">
      <div className="max-w-screen-2xl mx-auto text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Neo-Invoice. All rights reserved.
      </div>
    </footer>
  )
}
