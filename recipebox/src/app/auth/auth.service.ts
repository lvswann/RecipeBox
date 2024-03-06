import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';

import { Storage } from  '@ionic/storage';
import { User } from  './user';
import { AuthResponse } from  './auth-response';

import{StorageService} from './storage.service'
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	token = '';
  public isValidToken=false


  constructor(
    private http: HttpClient, private _router: Router,
    private storageService:StorageService, 
    private router:Router
    ) 
    {
           
    }

  async isAuthenticatedUser()
    {
      const token=await this.storageService.get("token");  
      if(!token) 
      return false;
      
      var isExpired=this.isTokenExpired(token);  
      if (isExpired) {
        return false;
      } else {
        return true;
      } 
    }
    private isTokenExpired(token: any) {
      const decodedToken= jwtDecode(token);    
      var expiry=decodedToken['exp'];
      if (typeof expiry === "undefined") { expiry = 0}
      var isExpired= (Math.floor((new Date).getTime() / 1000)) >= expiry;
      return isExpired;
    }
    
  async registerUser(formData: any)
  {


      if(!formData) return;

      // const options = {
      //   url: 'http://localhost:5000/api/user/register', 
      //   headers: { 'Content-Type': 'application/json'  },       
      //   data: JSON.stringify(formData),
      // };
    
      // try{
      //   const response: HttpResponse = await CapacitorHttp.post(options);        
      //   return response.data; 
      // }
      // catch(e)
      // {
      //   return;
      // }     

      this.http.post('http://127.0.0.1:5000/register/', formData)
      .subscribe({
        next: (response) => {
          console.log('POST Response:', response);

          // if(response && response.token)
          // {
          //     this.storageService.set("token",response.token);
          //     this.isAuthenticated.next(true);
          //     this._router.navigate(['/home'])
          //     return;
          //   } 
          //   else
          //   return "Invalid Credentials";     
            
          // }
          // catch(e)
          // {
          //   return;
          // }    

        },

        error: (error) => {
          console.error("POST error", error);
        },

        complete: () => {},
    });
  }

 public response:any;

  async login(formData: any)
  {
    
      if(!formData) return;

      this.http.post('http://127.0.0.1:5000/login/', formData, {responseType: 'json'})
      .subscribe(responseData => {    
        this.response = responseData;

        console.log('POST Response:', this.response);

        if(this.response && this.response.access_token)
          {
              this.storageService.set("token",this.response.token);
              this.isAuthenticated.next(true);
              this._router.navigate(['/home'])

              
              this.checkAuthentication()

              console.log(this.isAuthenticated);

              return;
            } 
            else
            console.log('Not good?');


            return "Invalid Credentials";

      }, (error: any) => {
        console.log(" Error from http post"+error)
    });

      

      // this.http.post('http://127.0.0.1:5000/login/', formData)
      // .subscribe({
        // next: (response) => {
        //   console.log('POST Response:', response);

        //   if(response && response.access_token)
        //   {
        //       this.storageService.set("token",response.token);
        //       this.isAuthenticated.next(true);
        //       this._router.navigate(['/home'])
        //       return;
        //     } 
        //     else
        //     return "Invalid Credentials";     
            

        // },



      // const options = {
      //   url: 'http://localhost:5000/api/user/login', 
      //   headers: { 'Content-Type': 'application/json'  },       
      //   ,
      // };

  //     error: (error) => {
  //       console.error("POST error", error);
  //     },

  //     complete: () => {},
  // });

    
      // try{
      //   const response: HttpResponse = await CapacitorHttp.post(options);
      //   const res=response.data
      //   if(res && res.token)
      //   {
      //       this.storageService.set("token",res.token);
      //       this.isAuthenticated.next(true);
      //       this.router.navigateByUrl('/profile', { replaceUrl: true });
      //       return;
      //     } 
      //   else
      //   return "Invalid Credentials";     
        
      // }
      // catch(e)
      // {
      //   return;
      // }     
  }
  async logout() {
		this.isAuthenticated.next(false);
		await this.storageService.remove("token");
    this.router.navigateByUrl('/login', { replaceUrl: true });
	}  
 

  public async checkAuthentication(){

    const token=await this.storageService.get("token"); 
    if(!token)  return false;    

    var isExpired=this.isTokenExpired(token);
    console.log("isExpired  " +isExpired)
    if (isExpired) return false;
    
    var isValidToken=false;  
    isValidToken=await this.validateToken(token);
    console.log("isValidToken" +isValidToken)
       
    if(!isValidToken)
      return false;      
    else
      return true;      

  }

  async validateToken(token:any)
  {
    const options = {
      url: 'http://localhost:5000/api/verify', 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" 
        }  
    };
  
    try{
      const response: HttpResponse = await CapacitorHttp.post(options);
      const res=response.data      
      if(res)
        return true;
      else
        return false;    
    }
    catch(e)
    {
      return false;
    }     
  }


}
