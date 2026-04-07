import { HashRouter, Routes, Route } from 'react-router-dom'
import AlbumsScreen from './screens/AlbumsScreen'
import AlbumDetail from './screens/AlbumDetail'
import TripCreation from './screens/TripCreation'

export default function App() {
  return (
    <HashRouter>
      <div className="phone-frame">
        <Routes>
          <Route path="/" element={<AlbumsScreen />} />
          <Route path="/album/:id" element={<AlbumDetail />} />
          <Route path="/create" element={<TripCreation />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
