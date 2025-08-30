/**
 * @fileoverview Initialize the Municipal Complaint Management System app
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import './components/PromptDjMidi'; // Contains ComplaintApp
import { ToastMessage } from './components/ToastMessage';

function main() {
  const toast = new ToastMessage();
  document.body.appendChild(toast);

  const app = document.createElement('complaint-app');
  document.body.appendChild(app);

  document.body.addEventListener('show-toast', (e: Event) => {
    const customEvent = e as CustomEvent<string>;
    if (customEvent.detail) {
      toast.show(customEvent.detail);
    }
  });
}

main();
