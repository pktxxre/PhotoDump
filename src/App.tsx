import { HashRouter, Routes, Route } from 'react-router-dom'
import AlbumsScreen from './screens/AlbumsScreen'
import AlbumDetail from './screens/AlbumDetail'
import GlobalMapScreen from './screens/GlobalMapScreen'
import TripCreation from './screens/TripCreation'
import ProfileScreen from './screens/ProfileScreen'

export default function App() {
  return (
    <HashRouter>
      <div className="phone-frame">
        <Routes>
          <Route path="/" element={<AlbumsScreen />} />
          <Route path="/album/:id" element={<AlbumDetail />} />
          <Route path="/map" element={<GlobalMapScreen />} />
          <Route path="/create" element={<TripCreation />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
