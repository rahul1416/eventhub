'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import QRCode from 'react-qr-code'
import { motion } from 'framer-motion'
const QRCodeGenerator = () => {
  const searchParams = useSearchParams()
  const firstName = searchParams.get('firstName') || ''
  const lastName = searchParams.get('lastName') || ''
  const email = searchParams.get('email') || ''
  const qrValue = `First Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}`
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
        🎟️ Attendee QR Code
        </h2>
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <p><span className="font-medium">First Name:</span> {firstName || 'N/A'}</p>
          <p><span className="font-medium">Last Name:</span> {lastName || 'N/A'}</p>
          <p><span className="font-medium">Email:</span> {email || 'N/A'}</p>
        </div>
        <div className="flex justify-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
          <QRCode
            value={qrValue}
            size={128}
            bgColor="transparent"
            fgColor="#000"
            className="dark:invert"
          />
        </div>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          This QR encodes attendee info for quick access :rocket:
        </p>
      </motion.div>
    </div>
  )
}
export default QRCodeGenerator