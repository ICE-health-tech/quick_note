import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { EditorPage } from '@/features/rooms/components/EditorPage'
import { JoinPage } from '@/features/rooms/components/JoinPage'
import { ROUTES } from '@/shared/constants/routes'

function RoomRedirect() {
  const { roomId = '' } = useParams()
  return <Navigate to={ROUTES.editor(decodeURIComponent(roomId))} replace />
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<JoinPage />} />
        <Route path="/:roomId/page" element={<EditorPage />} />
        <Route path="/:roomId" element={<RoomRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}
