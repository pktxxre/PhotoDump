import { HashRouter, Routes, Route } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import MapView from './screens/MapView'
import UploadQueue from './screens/UploadQueue'
import TripGallery from './screens/TripGallery'
import TripCreation from './screens/TripCreation'

export default function App() {
  return (
    <HashRouter>
      <div className="phone-frame">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/explore" element={<MapView />} />
          <Route path="/capture" element={<UploadQueue />} />
          <Route path="/journal" element={<TripGallery />} />
          <Route path="/create" element={<TripCreation />} />
          <Route path="/settings" element={<HomeScreen />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
