import { Skeleton, Stack } from '@mui/material'
import React from 'react'

const ChatLoading = () => {
  return (
    <div>
      <Stack>
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />

      </Stack>
    </div>
  )
}

export default ChatLoading
