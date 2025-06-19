// Simple toast notification utility
export interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

export const showToast = ({ message, type = 'success', duration = 3000 }: ToastOptions) => {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container')
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2'
    document.body.appendChild(toastContainer)
  }

  // Create toast element
  const toast = document.createElement('div')
  const toastId = `toast-${Date.now()}`
  toast.id = toastId
  
  const bgColor = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-600',
    error: 'bg-gradient-to-r from-red-500 to-rose-600',
    info: 'bg-gradient-to-r from-blue-500 to-indigo-600'
  }[type]

  const icon = {
    success: '✅',
    error: '❌', 
    info: 'ℹ️'
  }[type]

  toast.className = `${bgColor} text-white px-4 py-3 rounded-xl shadow-2xl shadow-slate-200/50 backdrop-blur-sm flex items-center gap-3 min-w-[320px] transform transition-all duration-300 translate-x-full opacity-0`
  
  toast.innerHTML = `
    <span class="text-lg">${icon}</span>
    <span class="font-medium flex-1">${message}</span>
    <button class="text-white/80 hover:text-white transition-colors ml-2" onclick="document.getElementById('${toastId}').remove()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `

  // Add to container
  toastContainer.appendChild(toast)

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full', 'opacity-0')
  }, 10)

  // Auto remove after duration
  setTimeout(() => {
    if (document.getElementById(toastId)) {
      toast.classList.add('translate-x-full', 'opacity-0')
      setTimeout(() => {
        if (document.getElementById(toastId)) {
          toast.remove()
        }
      }, 300)
    }
  }, duration)
}

// Convenience methods
export const showSuccessToast = (message: string) => 
  showToast({ message, type: 'success' })

export const showErrorToast = (message: string) => 
  showToast({ message, type: 'error' })

export const showInfoToast = (message: string) => 
  showToast({ message, type: 'info' }) 