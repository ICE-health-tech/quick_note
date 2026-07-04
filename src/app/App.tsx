import { AppRoutes } from '@/app/routes'
import { Providers } from '@/app/providers'
import { BackendGate } from '@/shared/components/BackendGate'

export function App() {
  return (
    <Providers>
      <BackendGate>
        <AppRoutes />
      </BackendGate>
    </Providers>
  )
}
