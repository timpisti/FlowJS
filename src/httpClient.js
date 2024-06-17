import { apiBaseURL } from './config';

export class HttpClient {
  async get(endpoint, headers = {}) {
    const url = `${apiBaseURL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...headers },
      });
      return await this._handleResponse(response);
    } catch (error) {
      this._handleError(error);
    }
  }

  async post(endpoint, data, headers = {}) {
    const url = `${apiBaseURL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(data),
      });
      return await this._handleResponse(response);
    } catch (error) {
      this._handleError(error);
    }
  }

  async _handleResponse(response) {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    return await response.json();
  }

  _handleError(error) {
    console.error('HTTP Error:', error);
    throw error;
  }
}

// Expose the HttpClient globally
window.httpClient = new HttpClient();
