import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('azle-app')
export class AzleApp extends LitElement {

    render() {
        return html`
            <h1>Estia</h1>
            <h2>Powered by XRP Ledger</h2>

            <p>/hash - generate the hash</p>
            <p>/verify - verify the hash</p>
        `;
    }
}
