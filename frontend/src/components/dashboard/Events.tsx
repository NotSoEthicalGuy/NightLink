import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import EventList from './events/EventList'
import CreateEvent from './events/CreateEvent'
import ViewEvent from './events/ViewEvent'
import EditEvent from './events/EditEvent'
import EventHistory from './events/EventHistory'

export default function Events() {
    return (
        <AnimatePresence mode="wait">
            <Routes>
                <Route index element={<EventList />} />
                <Route path="history" element={<EventHistory />} />
                <Route path="new" element={<CreateEvent />} />
                <Route path=":id" element={<ViewEvent />} />
                <Route path=":id/edit" element={<EditEvent />} />
            </Routes>
        </AnimatePresence>
    )
}
