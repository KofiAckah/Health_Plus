import axios from "axios";
import { BackendLink } from "../Components/Default";

class ConfigService {
  constructor() {
    this.googleMapsApiKey = null;
    this.geminiApiKey = null;
  }

  async getGoogleMapsApiKey() {
    if (this.googleMapsApiKey) {
      return this.googleMapsApiKey;
    }

    try {
      const response = await axios.get(`${BackendLink}/config/google-maps-key`);
      this.googleMapsApiKey = response.data.apiKey;
      return this.googleMapsApiKey;
    } catch (error) {
      console.error("Error fetching Google Maps API key:", error);
      // Fallback to environment variable if backend fails
      return process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    }
  }

  async getGeminiApiKey() {
    if (this.geminiApiKey) {
      return this.geminiApiKey;
    }

    try {
      const response = await axios.get(`${BackendLink}/config/gemini-key`);
      this.geminiApiKey = response.data.apiKey;
      return this.geminiApiKey;
    } catch (error) {
      console.error("Error fetching Gemini API key:", error);
      // Fallback to environment variable if backend fails
      return process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
    }
  }

  // Clear cached API keys (useful for testing)
  clearCache() {
    this.googleMapsApiKey = null;
    this.geminiApiKey = null;
  }
}

// Export singleton instance
export default new ConfigService();
