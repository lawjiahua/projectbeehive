import { Alert } from "../models/Alert";
import { Beehive } from "../models/Beehive";
import { BeehiveAlertResponse } from "../models/BeehiveAlertResponse";
import { IndividalBeehiveResponse } from "../models/IndividualBeehiveResponse";
import { User } from "../models/User";

class ApiService {
  private static API_BASE_URL: string = 'http://127.0.0.1:5000'; // local test 
  // private static API_BASE_URL: string = 'http://13.215.47.20:5000'; // aws instance

  static async loginWithGoogle(token : string): Promise<any> {
    try{
      const response = await fetch(`${this.API_BASE_URL}/auth/google_login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      if(response.ok){
        const data = await response.json();
        return data;
      } else {
        throw new Error('Something went wrong with the login. Check server logs')
      }
    }catch(error){
      console.error("Error with getting and passing google token", error);
      throw error;
    }
  }
  
  // Method to fetch user information
  static async fetchUserInfo(token : string): Promise<User> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/user_info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Correctly interpolate the token into the header
        },
      });

        if (!response.ok) {
        throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
  } 

  static async getBeehiveAlerts(beehiveNames: string[]): Promise<BeehiveAlertResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/alert/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ beehives: beehiveNames }),
      });
      if(response.ok) {
        const alerts = await response.json();
        return alerts;
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Unknown error occurred while fetching beehive alerts');
      }
    } catch(error) {
      console.error("Error fetching beehive alerts", error);
      throw error;
    }
  }

  static async getOutstandingAlerts(beehiveName: string): Promise<Alert[]> {
    try {
        const response = await fetch(`${this.API_BASE_URL}/alert/getAlertByBeehive/${beehiveName}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const alerts: Alert[] = await response.json();
        return alerts;
    } catch (error) {
        console.error('Error fetching alerts:', error);
        throw error;  // Re-throw to let the caller handle it
    }
  };  
  

}

export default ApiService;
  