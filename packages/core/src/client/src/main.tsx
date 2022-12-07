import ReactDOM from 'react-dom/client'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import App from './app'

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement)

root.render(<App></App>)
