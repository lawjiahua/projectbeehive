import { Alert } from "../models/Alert";
import { Beehive } from "../models/Beehive";
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
        console.log("TOKEN FROM BACKEND  \n" + data);
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
      const response = await fetch(`${this.API_BASE_URL}/user_info`, {
        method: 'GET',
        headers: {
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

  // Example method to fetch user beehives
  public static async fetchUserBeehives(): Promise<any> {
    const response = await fetch(`${this.API_BASE_URL}/user_beehives`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }

  public static async fetchAllBeehives(): Promise<Beehive[]> {
    const response = await fetch(`${this.API_BASE_URL}/beehives`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }

  public static async fetchAllAlerts(): Promise<Alert[]> {
      const response = await fetch(`${this.API_BASE_URL}/alerts`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
  }

  public static async fetchIndividualBeehiveData(beehiveName: string): Promise<IndividalBeehiveResponse> {
    const response = await fetch(`${this.API_BASE_URL}/individualBeehiveData/${beehiveName}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }

  public static async fetchBeehiveData(beehiveName: string, startDate: string, endDate: string): Promise<any> {
    const response = await fetch(`${this.API_BASE_URL}/${encodeURIComponent(beehiveName)}?start_date=${startDate}&end_date=${endDate}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
  
    // Add more methods as needed for other endpoints
  }
  
  export default ApiService;
  