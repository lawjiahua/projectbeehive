// src/services/ApiService.ts

import { Alert } from "../models/Alert";
import { Beehive } from "../models/Beehive";

class ApiService {
    private static API_BASE_URL: string = 'http://13.215.47.20:5000'; // Adjust as necessary
  
    // Method to get authorization headers
    private static getAuthHeaders(): HeadersInit {
      const token = localStorage.getItem('auth_token'); // Assuming the token is stored in localStorage
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
    }
  
    // Example method to fetch user beehives
    public static async fetchUserBeehives(): Promise<any> {
      const response = await fetch(`${this.API_BASE_URL}/user_beehives`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }

    public static async fetchAllBeehives(): Promise<Beehive[]> {
      const response = await fetch(`${this.API_BASE_URL}/beehives`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }

    public static async fetchAllAlerts(): Promise<Alert[]> {
        const response = await fetch(`${this.API_BASE_URL}/alerts`, {
          method: 'GET',
          headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
    }

    public static async fetchIndividualBeehiveData(beehiveName: string): Promise<any> {
      const response = await fetch(`${this.API_BASE_URL}/individualbeehiveData/${beehiveName}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }

    public static async fetchBeehiveData(beehiveName: string, startDate: string, endDate: string): Promise<any> {
      const response = await fetch(`${this.API_BASE_URL}/${encodeURIComponent(beehiveName)}?start_date=${startDate}&end_date=${endDate}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  
    // Add more methods as needed for other endpoints
  }
  
  export default ApiService;
  