import * as ReactDOM from 'react-dom/client';

import { StrictMode } from 'react';
import { useTranslation } from 'react-i18next';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <div>App</div>
  </StrictMode>,
);
